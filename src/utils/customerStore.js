/**
 * Customer & Orders Store — Supabase Database Layer with Local Fallback Sync
 */
import { supabase } from './supabase';

const CUSTOMER_SESSION_KEY = 'lunar_customer_session';
const LOCAL_CUSTOMERS_KEY = 'lunar_local_customers';
const LOCAL_ORDERS_KEY = 'lunar_local_orders';

// Helpers for Local Storage Fallback
function getLocalCustomers() {
  try {
    const raw = localStorage.getItem(LOCAL_CUSTOMERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCustomers(list) {
  try {
    localStorage.setItem(LOCAL_CUSTOMERS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save local customers', e);
  }
}

function getLocalOrders() {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalOrders(list) {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save local orders', e);
  }
}

/**
 * Register a new customer in both Supabase Auth (auth.users) and public.customers
 */
export async function registerCustomer(customerData) {
  const { email, password, fullName, phone, address, city, state, postalCode, country } = customerData;
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();
  const cleanPhone = (phone || '').trim();

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: 'Email and password are required.' };
  }

  const payload = {
    email: cleanEmail,
    password: cleanPassword,
    full_name: (fullName || '').trim(),
    phone: cleanPhone,
    address: (address || '').trim(),
    city: (city || '').trim(),
    state: (state || '').trim(),
    postal_code: (postalCode || '').trim(),
    country: (country || 'United States').trim(),
  };

  try {
    // 1. Register in Supabase Auth (auth.users) so they appear in Supabase Dashboard -> Users
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: {
            full_name: payload.full_name,
            phone: payload.phone,
          },
        },
      });
      if (authError && !authError.message?.toLowerCase().includes('already registered')) {
        console.info('Supabase Auth signUp note:', authError.message);
      }
    } catch (authException) {
      console.warn('Supabase Auth registration notice:', authException);
    }

    // 2. Insert into public.customers table
    const { data, error } = await supabase
      .from('customers')
      .insert([payload])
      .select('id, email, password, full_name, phone, address, city, state, postal_code, country, created_at')
      .single();

    if (!error && data) {
      const customer = {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postal_code,
        country: data.country,
      };

      // Save to local storage for offline fallback
      const localList = getLocalCustomers();
      const existingIdx = localList.findIndex((c) => c.email === cleanEmail);
      if (existingIdx !== -1) {
        localList[existingIdx] = { ...data, fullName: data.full_name, postalCode: data.postal_code };
      } else {
        localList.push({ ...data, fullName: data.full_name, postalCode: data.postal_code });
      }
      saveLocalCustomers(localList);

      return { success: true, customer };
    }

    if (error) {
      if (error.code === '23505' || error.message?.toLowerCase().includes('unique') || error.message?.toLowerCase().includes('duplicate')) {
        return { success: false, error: 'An account with this email or mobile number already exists.' };
      }
      console.warn('Supabase customer registration notice:', error.message);
    }
  } catch (err) {
    console.warn('Supabase customer registration error, using local fallback:', err);
  }

  // 3. Local fallback registration
  const localList = getLocalCustomers();
  const existing = localList.find((c) => c.email === cleanEmail || (cleanPhone && c.phone === cleanPhone));
  if (existing) {
    return { success: false, error: 'An account with this email or mobile number already exists.' };
  }

  const newLocalCustomer = {
    id: `cust_local_${Date.now()}`,
    email: cleanEmail,
    password: cleanPassword,
    fullName: payload.full_name,
    phone: payload.phone,
    address: payload.address,
    city: payload.city,
    state: payload.state,
    postalCode: payload.postal_code,
    country: payload.country,
    createdAt: new Date().toISOString(),
  };

  localList.push(newLocalCustomer);
  saveLocalCustomers(localList);

  const { password: _, ...customerWithoutPassword } = newLocalCustomer;
  return { success: true, customer: customerWithoutPassword };
}

/**
 * Customer Login — Supports Email OR Mobile Number + Password
 */
export async function loginCustomer(identifier, password) {
  const cleanId = (identifier || '').trim();
  const cleanPass = (password || '').trim();

  if (!cleanId || !cleanPass) {
    return { success: false, error: 'Please enter your email or mobile number and password.' };
  }

  const isEmail = cleanId.includes('@');
  const cleanEmail = cleanId.toLowerCase();
  const cleanDigits = cleanId.replace(/\D/g, '');

  try {
    // 1. Supabase Query
    let query = supabase
      .from('customers')
      .select('id, email, password, full_name, phone, address, city, state, postal_code, country, created_at')
      .eq('password', cleanPass);

    if (isEmail) {
      query = query.eq('email', cleanEmail);
    } else {
      // Query by phone or email
      query = query.or(`phone.eq."${cleanId}",email.eq."${cleanEmail}"`);
    }

    const { data, error } = await query.maybeSingle();

    if (!error && data) {
      const customer = {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postal_code,
        country: data.country,
      };
      return { success: true, customer };
    }

    // If query by exact phone failed and identifier has digits, try query by digit phone matching
    if (!isEmail && cleanDigits.length >= 7) {
      const { data: phoneMatches, error: matchErr } = await supabase
        .from('customers')
        .select('id, email, password, full_name, phone, address, city, state, postal_code, country, created_at')
        .eq('password', cleanPass);

      if (!matchErr && phoneMatches && phoneMatches.length > 0) {
        const matched = phoneMatches.find((c) => {
          const custDigits = (c.phone || '').replace(/\D/g, '');
          return custDigits === cleanDigits || custDigits.endsWith(cleanDigits) || cleanDigits.endsWith(custDigits);
        });

        if (matched) {
          return {
            success: true,
            customer: {
              id: matched.id,
              email: matched.email,
              fullName: matched.full_name,
              phone: matched.phone,
              address: matched.address,
              city: matched.city,
              state: matched.state,
              postalCode: matched.postal_code,
              country: matched.country,
            },
          };
        }
      }
    }

    if (error) {
      console.warn('Supabase customer login query notice:', error.message);
    }
  } catch (err) {
    console.warn('Supabase customer login exception:', err);
  }

  // 2. Fallback to Local Customers
  const localList = getLocalCustomers();
  const found = localList.find((c) => {
    const emailMatch = (c.email || '').toLowerCase() === cleanEmail;
    const custDigits = (c.phone || '').replace(/\D/g, '');
    const phoneMatch =
      (c.phone || '').trim() === cleanId ||
      (cleanDigits.length >= 7 && (custDigits === cleanDigits || custDigits.endsWith(cleanDigits) || cleanDigits.endsWith(custDigits)));
    return (emailMatch || phoneMatch) && (c.password || '').trim() === cleanPass;
  });

  if (found) {
    const { password: _, ...customerWithoutPassword } = found;
    return {
      success: true,
      customer: {
        ...customerWithoutPassword,
        fullName: customerWithoutPassword.fullName || customerWithoutPassword.full_name,
        postalCode: customerWithoutPassword.postalCode || customerWithoutPassword.postal_code,
      },
    };
  }

  // Demo user fallback check
  if (
    (cleanEmail === 'alex.vanguard@lunar.com' || cleanDigits.includes('5550192834') || cleanId === '+1 (555) 019-2834') &&
    cleanPass === 'lunar@123'
  ) {
    const demoUser = {
      id: 'cust_demo_alex',
      email: 'alex.vanguard@lunar.com',
      fullName: 'Alex Vanguard',
      phone: '+1 (555) 019-2834',
      address: '42 Lunar Boulevard, Suite 800',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States',
    };
    return { success: true, customer: demoUser };
  }

  return { success: false, error: 'Invalid mobile number, email, or password.' };
}

/**
 * Helper to mask an email or phone for display
 */
export function maskIdentifier(identifier) {
  if (!identifier) return '';
  const str = identifier.trim();
  if (str.includes('@')) {
    const [name, domain] = str.split('@');
    if (name.length <= 2) {
      return `${name[0]}***@${domain}`;
    }
    return `${name[0]}***${name[name.length - 1]}@${domain}`;
  }
  const digits = str.replace(/\D/g, '');
  if (digits.length >= 7) {
    return str.replace(/(\d{3})\d+(\d{4})/, '$1-***-$2');
  }
  return str.slice(0, 3) + '***' + str.slice(-2);
}

/**
 * Format phone to E.164 if possible
 */
export function formatPhoneE164(phoneStr) {
  const cleaned = (phoneStr || '').trim();
  if (cleaned.startsWith('+')) {
    return cleaned.replace(/[^+\d]/g, '');
  }
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  return `+${digits}`;
}

/**
 * Check if an email or phone number is registered in Supabase or Local Storage
 */
export async function checkUserRegistered(identifier) {
  const cleanId = (identifier || '').trim();
  if (!cleanId) return { registered: false };
  const isEmail = cleanId.includes('@');
  const cleanEmail = cleanId.toLowerCase();
  const cleanDigits = cleanId.replace(/\D/g, '');

  // 1. Check Supabase 'customers' table
  try {
    let query = supabase.from('customers').select('id, email, phone, full_name');
    if (isEmail) {
      query = query.eq('email', cleanEmail);
    } else {
      query = query.or(`phone.eq."${cleanId}",email.eq."${cleanEmail}"`);
    }
    const { data, error } = await query.maybeSingle();
    if (!error && data) return { registered: true, customer: data };

    if (!isEmail && cleanDigits.length >= 7) {
      const { data: allCusts } = await supabase.from('customers').select('id, email, phone, full_name');
      if (allCusts && allCusts.length > 0) {
        const match = allCusts.find((c) => {
          const d = (c.phone || '').replace(/\D/g, '');
          return d === cleanDigits || d.endsWith(cleanDigits) || cleanDigits.endsWith(d);
        });
        if (match) return { registered: true, customer: match };
      }
    }
  } catch (e) {
    console.warn('Supabase customer existence check error:', e);
  }

  // 2. Check Local Customers
  const localList = getLocalCustomers();
  const found = localList.find((c) => {
    const emailMatch = (c.email || '').toLowerCase() === cleanEmail;
    const custDigits = (c.phone || '').replace(/\D/g, '');
    const phoneMatch =
      (c.phone || '').trim() === cleanId ||
      (cleanDigits.length >= 7 && (custDigits === cleanDigits || custDigits.endsWith(cleanDigits) || cleanDigits.endsWith(custDigits)));
    return emailMatch || phoneMatch;
  });
  if (found) return { registered: true, customer: found };

  // 3. Check Demo User
  if (
    cleanEmail === 'alex.vanguard@lunar.com' ||
    cleanDigits.includes('5550192834') ||
    cleanId === '+1 (555) 019-2834'
  ) {
    return {
      registered: true,
      customer: {
        id: 'cust_demo_alex',
        email: 'alex.vanguard@lunar.com',
        fullName: 'Alex Vanguard',
        phone: '+1 (555) 019-2834',
      },
    };
  }

  return { registered: false };
}

/**
 * Send Password Reset OTP via Supabase Auth
 * OTP is dispatched to the user's email via Supabase's native resetPasswordForEmail flow.
 */
export async function sendPasswordResetOtp(identifier) {
  const cleanId = (identifier || '').trim();
  if (!cleanId) {
    return { success: false, error: 'Please enter your registered email address or mobile number.' };
  }

  const isEmail = cleanId.includes('@');
  const cleanEmail = cleanId.toLowerCase();

  // 1. Verify that the user is registered in the database or local storage first
  const check = await checkUserRegistered(cleanId);
  if (!check.registered) {
    return {
      success: false,
      notRegistered: true,
      error: `We could not find an account associated with "${cleanId}". Please check your input or create a new account.`,
    };
  }

  // 2. Dispatch Supabase Auth native password recovery email/OTP
  if (isEmail) {
    try {
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
      let { error: resetErr } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl,
      });

      // If user exists in DB/local customers but not yet in Supabase Auth (auth.users), create them and retry
      if (resetErr) {
        const lowerMsg = resetErr.message?.toLowerCase() || '';
        if (lowerMsg.includes('error sending') || lowerMsg.includes('not found') || lowerMsg.includes('user not found')) {
          try {
            const { error: signUpErr } = await supabase.auth.signUp({
              email: cleanEmail,
              password: 'TempPassword@' + Math.floor(100000 + Math.random() * 900000),
            });
            if (!signUpErr || signUpErr.message?.toLowerCase().includes('already registered')) {
              const retry = await supabase.auth.resetPasswordForEmail(cleanEmail, {
                redirectTo: redirectUrl,
              });
              if (!retry.error) {
                resetErr = null;
              } else {
                resetErr = retry.error;
              }
            }
          } catch (provisionErr) {
            console.warn('Auto-provision auth user attempt:', provisionErr);
          }
        }
      }

      if (resetErr) {
        console.warn('Supabase resetPasswordForEmail error:', resetErr.message);
        const lowerMsg = resetErr.message?.toLowerCase() || '';
        if (lowerMsg.includes('rate limit') || lowerMsg.includes('security purposes') || lowerMsg.includes('seconds')) {
          return {
            success: false,
            error: 'For security purposes, password reset requests are rate-limited. Please wait 60 seconds before requesting another code.',
          };
        }
        if (lowerMsg.includes('error sending recovery email') || lowerMsg.includes('error sending')) {
          return {
            success: false,
            error: 'Supabase email rate limit exceeded or SMTP delivery failed. Please wait a few minutes or configure custom SMTP in your Supabase Dashboard.',
          };
        }
        if (lowerMsg.includes('not found') || lowerMsg.includes('user not found')) {
          return {
            success: false,
            notRegistered: true,
            error: `No registered user found with email "${cleanEmail}".`,
          };
        }
        return {
          success: false,
          error: resetErr.message || 'Failed to send password reset code. Please try again.',
        };
      }
    } catch (authErr) {
      console.warn('Supabase Auth reset exception:', authErr);
      return {
        success: false,
        error: authErr.message || 'An unexpected error occurred while sending reset email.',
      };
    }
  } else {
    // Phone OTP recovery via SMS
    try {
      const formattedPhone = formatPhoneE164(cleanId);
      const { error: phoneErr } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: { shouldCreateUser: false },
      });
      if (phoneErr) {
        return {
          success: false,
          error: phoneErr.message || 'Failed to send SMS verification code.',
        };
      }
    } catch (phoneEx) {
      return {
        success: false,
        error: 'Unable to dispatch phone verification SMS.',
      };
    }
  }

  // Store latest target in session storage for state consistency
  try {
    sessionStorage.setItem('lunar_latest_reset_target', isEmail ? cleanEmail : cleanId);
  } catch (e) {}

  return {
    success: true,
    method: isEmail ? 'email' : 'phone',
    target: isEmail ? cleanEmail : cleanId,
    maskedTarget: maskIdentifier(isEmail ? cleanEmail : cleanId),
    message: isEmail
      ? `A 6-digit verification code has been dispatched to ${maskIdentifier(cleanEmail)}. Please check your inbox and spam folder.`
      : `A 6-digit verification code has been dispatched to ${maskIdentifier(cleanId)}.`,
  };
}

/**
 * Verify Password Reset OTP using Supabase Auth (type: 'recovery')
 */
export async function verifyPasswordResetOtp(identifier, otpCode) {
  const cleanId = (identifier || sessionStorage.getItem('lunar_latest_reset_target') || '').trim();
  const cleanOtp = (otpCode || '').trim().replace(/\s/g, '');

  if (!cleanId) {
    return { success: false, error: 'Target email is missing. Please restart the password reset flow.' };
  }

  if (!cleanOtp) {
    return { success: false, error: 'Please enter the 6-digit verification code from your email.' };
  }

  if (cleanOtp.length < 6) {
    return { success: false, error: 'Please enter the complete 6-digit OTP code.' };
  }

  const isEmail = cleanId.includes('@');
  const cleanEmail = cleanId.toLowerCase();

  try {
    if (isEmail) {
      // Must use type: 'recovery' for password reset verification in Supabase Auth
      const { data, error } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanOtp,
        type: 'recovery',
      });

      if (error) {
        console.warn('Supabase auth verifyOtp error:', error.message);
        const lowerMsg = error.message?.toLowerCase() || '';

        if (lowerMsg.includes('expired') || lowerMsg.includes('invalid') || lowerMsg.includes('token')) {
          return {
            success: false,
            error: 'Invalid or expired verification code. If you requested multiple codes, please enter the code from the latest email received, or click Resend Code.',
          };
        }
        if (lowerMsg.includes('rate limit') || lowerMsg.includes('too many')) {
          return {
            success: false,
            error: 'Too many incorrect attempts. Please wait a moment before trying again.',
          };
        }
        return {
          success: false,
          error: error.message || 'Verification failed. Please check the code and try again.',
        };
      }

      if (data && (data.session || data.user)) {
        return {
          success: true,
          session: data.session,
          user: data.user,
          message: 'OTP verified successfully! You may now set your new password.',
        };
      }
    } else {
      const formattedPhone = formatPhoneE164(cleanId);
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: cleanOtp,
        type: 'sms',
      });
      if (error) {
        return { success: false, error: error.message || 'Invalid SMS verification code.' };
      }
      return { success: true, session: data?.session, user: data?.user, message: 'OTP verified successfully!' };
    }
  } catch (err) {
    console.error('OTP verification exception:', err);
    return { success: false, error: err.message || 'Verification error. Please try again.' };
  }

  return {
    success: false,
    error: 'Verification code not recognized. Please check the latest code in your email or request a new one.',
  };
}

/**
 * Update Customer Password in Supabase Database & Supabase Auth
 * Uses the active recovery session created during verifyOtp to update auth.users
 */
export async function updateSupabaseAuthPassword(newPassword, identifier = '') {
  const cleanPass = (newPassword || '').trim();
  if (!cleanPass || cleanPass.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  const cleanId = (identifier || sessionStorage.getItem('lunar_latest_reset_target') || '').trim();
  const isEmail = cleanId.includes('@');
  const cleanEmail = cleanId.toLowerCase();

  let authUpdated = false;
  let authErrorMsg = '';

  // 1. Update password in Supabase Auth (auth.users)
  try {
    const { data, error: authErr } = await supabase.auth.updateUser({
      password: cleanPass,
    });

    if (authErr) {
      console.warn('Supabase Auth updateUser note:', authErr.message);
      authErrorMsg = authErr.message;
    } else if (data?.user) {
      authUpdated = true;
    }
  } catch (authEx) {
    console.warn('Supabase Auth updateUser exception:', authEx);
    authErrorMsg = authEx.message;
  }

  // 2. Synchronize password directly into public.customers table
  try {
    const updatePayload = {
      password: cleanPass,
      updated_at: new Date().toISOString(),
    };

    let query = supabase.from('customers').update(updatePayload);
    if (isEmail && cleanEmail) {
      query = query.ilike('email', cleanEmail);
    } else if (cleanId) {
      query = query.eq('phone', cleanId);
    }

    const { error: dbErr } = await query;
    if (dbErr) {
      console.warn('Supabase customers table update warning:', dbErr.message);
    }
  } catch (err) {
    console.warn('Supabase DB password update error:', err);
  }

  // 3. Update local customers cache for offline fallback
  try {
    const localList = getLocalCustomers();
    let localUpdated = false;
    localList.forEach((c) => {
      if (
        (cleanEmail && (c.email || '').toLowerCase() === cleanEmail) ||
        (cleanId && (c.phone || '').trim() === cleanId)
      ) {
        c.password = cleanPass;
        c.updatedAt = new Date().toISOString();
        localUpdated = true;
      }
    });
    if (localUpdated) {
      saveLocalCustomers(localList);
    }
  } catch (e) {
    console.warn('Local customer storage sync error:', e);
  }

  // 4. Clear reset session markers
  try {
    sessionStorage.removeItem('lunar_latest_reset_target');
  } catch (e) {}

  if (authUpdated || !authErrorMsg) {
    return {
      success: true,
      message: 'Your password has been successfully reset! You can now sign in with your new credentials.',
    };
  }

  return {
    success: false,
    error: authErrorMsg || 'Failed to update password. Please try the reset process again.',
  };
}

export const updateCustomerPassword = updateSupabaseAuthPassword;


/**
 * Update Customer Profile & Delivery Address
 */
export async function updateCustomerProfile(id, updates) {
  if (!id) return { success: false, error: 'No customer ID provided' };

  const dbUpdates = {};
  if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.address !== undefined) dbUpdates.address = updates.address;
  if (updates.city !== undefined) dbUpdates.city = updates.city;
  if (updates.state !== undefined) dbUpdates.state = updates.state;
  if (updates.postalCode !== undefined) dbUpdates.postal_code = updates.postalCode;
  if (updates.country !== undefined) dbUpdates.country = updates.country;
  dbUpdates.updated_at = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from('customers')
      .update(dbUpdates)
      .eq('id', id)
      .select('id, email, full_name, phone, address, city, state, postal_code, country')
      .maybeSingle();

    if (!error && data) {
      return {
        success: true,
        customer: {
          id: data.id,
          email: data.email,
          fullName: data.full_name,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          postalCode: data.postal_code,
          country: data.country,
        },
      };
    }
  } catch (err) {
    console.warn('Supabase customer update exception:', err);
  }

  // Local fallback
  const localList = getLocalCustomers();
  const index = localList.findIndex((c) => c.id === id);
  if (index !== -1) {
    localList[index] = { ...localList[index], ...updates };
    saveLocalCustomers(localList);
    const { password: _, ...cleanCust } = localList[index];
    return { success: true, customer: cleanCust };
  }

  return {
    success: true,
    customer: { id, ...updates },
  };
}

/**
 * Place Order (Cash on Delivery or Card) & Save to Supabase
 */
export async function createOrder(orderPayload) {
  const {
    orderNumber,
    customerId,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    items,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    paymentMethod, // 'cod' | 'card'
    paymentStatus,
    notes,
  } = orderPayload;

  const row = {
    order_number: orderNumber,
    customer_id: customerId && !customerId.startsWith('cust_local_') && !customerId.startsWith('cust_demo_') ? customerId : null,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone || '',
    shipping_address: shippingAddress,
    items: items.map((it) => ({
      id: it.id,
      name: it.name,
      price: it.price,
      quantity: it.quantity,
      size: it.size || 'L',
      color: it.color || 'Onyx Black',
      image: it.image || it.images?.[0] || '',
    })),
    subtotal: Number(subtotal) || 0,
    discount_amount: Number(discountAmount) || 0,
    shipping_fee: Number(shippingFee) || 0,
    total_amount: Number(totalAmount) || 0,
    payment_method: paymentMethod || 'cod',
    payment_status: paymentStatus || (paymentMethod === 'cod' ? 'pending_cash_on_delivery' : 'paid'),
    order_status: 'processing',
    notes: notes || '',
    created_at: new Date().toISOString(),
  };

  let savedInSupabase = false;
  let supabaseRecord = null;

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([row])
      .select()
      .single();

    if (!error && data) {
      savedInSupabase = true;
      supabaseRecord = data;
    } else if (error) {
      console.warn('Supabase orders insert notice:', error.message);
    }
  } catch (err) {
    console.warn('Supabase orders insert error, saving to local fallback:', err);
  }

  // Always keep a local copy for instant retrieval & offline resilience
  const localOrders = getLocalOrders();
  const normalizedOrder = {
    id: supabaseRecord?.id || `ord_local_${Date.now()}`,
    orderNumber,
    customerId,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    items: row.items,
    subtotal: row.subtotal,
    discountAmount: row.discount_amount,
    shippingFee: row.shipping_fee,
    totalAmount: row.total_amount,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    orderStatus: row.order_status,
    notes: row.notes,
    createdAt: row.created_at,
    isCloud: savedInSupabase,
  };

  localOrders.unshift(normalizedOrder);
  saveLocalOrders(localOrders);

  return {
    success: true,
    order: normalizedOrder,
    isCloud: savedInSupabase,
  };
}

/**
 * Fetch orders for a customer (by customerId, email, or phone)
 */
export async function getCustomerOrders(customerId, customerEmail, customerPhone) {
  try {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

    if (customerId && !customerId.startsWith('cust_local_') && !customerId.startsWith('cust_demo_')) {
      if (customerEmail) {
        query = query.or(`customer_id.eq.${customerId},customer_email.eq.${customerEmail.toLowerCase()}`);
      } else {
        query = query.eq('customer_id', customerId);
      }
    } else if (customerEmail) {
      query = query.eq('customer_email', customerEmail.toLowerCase());
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return data.map((d) => ({
        id: d.id,
        orderNumber: d.order_number,
        customerId: d.customer_id,
        customerName: d.customer_name,
        customerEmail: d.customer_email,
        customerPhone: d.customer_phone,
        shippingAddress: d.shipping_address,
        items: d.items,
        subtotal: Number(d.subtotal),
        discountAmount: Number(d.discount_amount),
        shippingFee: Number(d.shipping_fee),
        totalAmount: Number(d.total_amount),
        paymentMethod: d.payment_method,
        paymentStatus: d.payment_status,
        orderStatus: d.order_status,
        createdAt: d.created_at,
      }));
    }
  } catch (err) {
    console.warn('Failed to fetch orders from Supabase:', err);
  }

  // Fallback to local orders
  const localOrders = getLocalOrders();
  if (customerEmail || customerPhone || customerId) {
    return localOrders.filter((o) => {
      const matchEmail = customerEmail && (o.customerEmail || '').toLowerCase() === customerEmail.toLowerCase();
      const matchPhone = customerPhone && (o.customerPhone || '') === customerPhone;
      const matchId = customerId && o.customerId === customerId;
      return matchEmail || matchPhone || matchId;
    });
  }
  return localOrders;
}

/**
 * Fetch all orders for Admin Portal
 */
export async function getAllOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map((d) => ({
        id: d.id,
        orderNumber: d.order_number,
        customerId: d.customer_id,
        customerName: d.customer_name,
        customerEmail: d.customer_email,
        customerPhone: d.customer_phone,
        shippingAddress: d.shipping_address,
        items: d.items,
        subtotal: Number(d.subtotal),
        discountAmount: Number(d.discount_amount),
        shippingFee: Number(d.shipping_fee),
        totalAmount: Number(d.total_amount),
        paymentMethod: d.payment_method,
        paymentStatus: d.payment_status,
        orderStatus: d.order_status,
        createdAt: d.created_at,
      }));
    }
  } catch (err) {
    console.warn('Failed to fetch admin orders from Supabase:', err);
  }

  return getLocalOrders();
}

/**
 * Update order status (for Admin)
 */
export async function updateOrderStatus(orderId, orderStatus, paymentStatus) {
  const updates = {};
  if (orderStatus) updates.order_status = orderStatus;
  if (paymentStatus) updates.payment_status = paymentStatus;
  updates.updated_at = new Date().toISOString();

  try {
    await supabase.from('orders').update(updates).eq('id', orderId);
  } catch (err) {
    console.warn('Failed to update order in Supabase:', err);
  }

  // Update in local
  const localList = getLocalOrders();
  const idx = localList.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    if (orderStatus) localList[idx].orderStatus = orderStatus;
    if (paymentStatus) localList[idx].paymentStatus = paymentStatus;
    saveLocalOrders(localList);
  }

  return { success: true };
}

/**
 * Fetch all registered customers for Admin Portal
 */
export async function getAllCustomers() {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('id, email, password, full_name, phone, address, city, state, postal_code, country, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((d) => ({
        id: d.id,
        email: d.email,
        password: d.password,
        fullName: d.full_name,
        phone: d.phone,
        address: d.address,
        city: d.city,
        state: d.state,
        postalCode: d.postal_code,
        country: d.country,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    }
  } catch (err) {
    console.warn('Failed to fetch customers from Supabase:', err);
  }

  // Fallback to local customers
  const localList = getLocalCustomers();
  if (localList.length > 0) {
    return localList.map((d) => ({
      id: d.id,
      email: d.email,
      password: d.password,
      fullName: d.fullName || d.full_name,
      phone: d.phone,
      address: d.address,
      city: d.city,
      state: d.state,
      postalCode: d.postalCode || d.postal_code,
      country: d.country,
      createdAt: d.createdAt || d.created_at,
      updatedAt: d.updatedAt || d.updated_at,
    }));
  }

  // Default demo customer if empty
  return [
    {
      id: 'cust_demo_alex',
      email: 'alex.vanguard@lunar.com',
      password: '•••••••• (lunar@123)',
      fullName: 'Alex Vanguard',
      phone: '+1 (555) 019-2834',
      address: '42 Lunar Boulevard, Suite 800',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States',
      createdAt: new Date().toISOString(),
    },
  ];
}
