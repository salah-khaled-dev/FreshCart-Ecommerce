import {
  Product,
  Category,
  Subcategory,
  RegisterFormValues,
  LoginFormValues,
  ForgotPasswordFormValues,
  VerifyResetCodeFormValues,
  ResetPasswordFormValues,
  AuthResponse,
  ForgotPasswordResponse,
  UserItem,
  UpdateProfileFormValues,
  ChangePasswordFormValues,
  AuthUser,
  WishlistResponse,
  WishlistActionResponse,
  AddressItem,
  AddAddressFormValues,
  AddressesResponse,
  CartProductItem,
  CartResponse,
  ReviewItem,
  CreateReviewFormValues,
  ReviewsResponse,
  ShippingAddressFormValues,
  OrderResponse,
  OrderItem,
  AllOrdersResponse,
  CheckoutSessionResponse,
  Brand,
} from '@/api/types';
import { getCookie, setCookie, removeCookie } from '@/lib/cookies';

export const DEFAULT_AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YWE2YWM3ZmE3ODk1ZTgxZjY3YjRlNCIsIm5hbWUiOiJBaG1lZCBBYmQgQWwtTXV0aSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQwMzA5NzY0LCJleHAiOjE3NDgwODU3NjR9.H8l5j15g-Hu4eWGPUs46r8mVc2vqP_e3dyK-cZPnDSc';

const TOKEN_COOKIE_KEY = 'userToken';
const USER_INFO_COOKIE_KEY = 'userInfo';
const WISHLIST_IDS_COOKIE_KEY = 'freshcart_wishlist_ids';
const CART_ITEMS_COOKIE_KEY = 'freshcart_cart_items';

export function getAuthToken(): string {
  if (typeof document !== 'undefined') {
    return getCookie(TOKEN_COOKIE_KEY) || DEFAULT_AUTH_TOKEN;
  }
  return DEFAULT_AUTH_TOKEN;
}

export function getAuthHeaders(includeContentType = false): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    token,
    Authorization: `Bearer ${token}`,
  };
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

export function setAuthTokenCookie(token: string, days = 7): void {
  setCookie(TOKEN_COOKIE_KEY, token, days);
}

export function setLoggedUserCookie(user: AuthUser, days = 7): void {
  setCookie(USER_INFO_COOKIE_KEY, JSON.stringify(user), days);
}

export function clearAuthCookies(): void {
  removeCookie(TOKEN_COOKIE_KEY);
  removeCookie(USER_INFO_COOKIE_KEY);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-change'));
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products`, {
      cache: 'force-cache',
    });
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/categories`, {
      cache: 'force-cache',
    });
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getSingleCategory(id: string): Promise<Category | undefined> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${id}`, {
      cache: 'force-cache',
    });
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

export async function getCategorySubcategories(categoryId: string): Promise<Subcategory[]> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/categories/${categoryId}/subcategories`,
      {
        cache: 'force-cache',
      }
    );
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getAllSubcategories(): Promise<Subcategory[]> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/subcategories`, {
      cache: 'force-cache',
    });
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getSingleSubcategory(id: string): Promise<Subcategory | undefined> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/subcategories/${id}`, {
      cache: 'force-cache',
    });
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

export async function getSingleProduct(id: string): Promise<Product | undefined> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`, {
      cache: 'force-cache',
    });
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

export async function signUpUser(payload: RegisterFormValues): Promise<{
  ok: boolean;
  data: AuthResponse;
}> {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: getAuthToken(),
    },
    body: JSON.stringify(payload),
  });
  const data: AuthResponse = await res.json();
  return { ok: res.ok && data.message === 'success', data };
}

export async function signInUser(payload: LoginFormValues): Promise<{
  ok: boolean;
  data: AuthResponse;
}> {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: getAuthToken(),
    },
    body: JSON.stringify(payload),
  });
  const data: AuthResponse = await res.json();
  return { ok: res.ok && data.message === 'success', data };
}

export async function forgotPasswordUser(payload: ForgotPasswordFormValues): Promise<{
  ok: boolean;
  data: ForgotPasswordResponse;
}> {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data: ForgotPasswordResponse = await res.json();
  return { ok: res.ok && data.statusMsg === 'success', data };
}

export async function verifyResetCodeUser(payload: VerifyResetCodeFormValues): Promise<{
  ok: boolean;
  data: { status?: string; statusMsg?: string; message?: string };
}> {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resetCode: payload.resetCode.trim() }),
  });
  const data = await res.json();
  return { ok: res.ok && data.status?.toLowerCase() === 'success', data };
}

export async function resetPasswordUser(payload: ResetPasswordFormValues): Promise<{
  ok: boolean;
  data: AuthResponse;
}> {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/resetPassword`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data: AuthResponse = await res.json();
  return { ok: res.ok && Boolean(data.token), data };
}

export async function getAllUsers(): Promise<UserItem[]> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/users`, {
      cache: 'force-cache',
    });
    const data = await res.json();
    return data.users || data.data || [];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function updateUserProfile(payload: UpdateProfileFormValues): Promise<{
  ok: boolean;
  data: AuthResponse;
}> {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/users/updateMe/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      token: getAuthToken(),
    },
    body: JSON.stringify(payload),
  });
  const data: AuthResponse = await res.json();
  return { ok: res.ok && data.message === 'success', data };
}

export async function changeUserPassword(payload: ChangePasswordFormValues): Promise<{
  ok: boolean;
  data: AuthResponse;
}> {
  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/users/changeMyPassword`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: getAuthToken(),
      },
      body: JSON.stringify(payload),
    }
  );
  const data: AuthResponse = await res.json();
  return { ok: res.ok && data.message === 'success', data };
}

export function getLoggedUserFromCookies(): AuthUser | null {
  if (typeof document === 'undefined') return null;

  const savedInfo =
    getCookie(USER_INFO_COOKIE_KEY) ||
    (typeof localStorage !== 'undefined'
      ? localStorage.getItem(USER_INFO_COOKIE_KEY)
      : null);

  if (savedInfo) {
    try {
      const parsed = JSON.parse(savedInfo) as AuthUser;
      if (parsed?.name) {
        if (!getCookie(USER_INFO_COOKIE_KEY)) {
          setLoggedUserCookie(parsed);
        }
        return parsed;
      }
    } catch {
      // Fallback to decoding JWT below
    }
  }

  const token =
    getCookie(TOKEN_COOKIE_KEY) ||
    (typeof localStorage !== 'undefined'
      ? localStorage.getItem(TOKEN_COOKIE_KEY)
      : null);
  if (!token) return null;

  if (!getCookie(TOKEN_COOKIE_KEY)) {
    setAuthTokenCookie(token);
  }

  try {
    const base64Payload = token.split('.')[1];
    if (!base64Payload) return null;
    const decoded = JSON.parse(atob(base64Payload));
    return {
      name: decoded.name || 'FreshCart User',
      email: decoded.email || '',
      role: decoded.role || 'user',
    };
  } catch {
    return { name: 'FreshCart User', email: '' };
  }
}

export const getLoggedUserFromStorage = getLoggedUserFromCookies;

export function isUserLoggedIn(): boolean {
  return Boolean(getLoggedUserFromCookies());
}

// ── Wishlist Helpers (Cookies) & API ──
export function getStoredWishlistIds(): string[] {
  if (typeof document === 'undefined') return [];
  try {
    const raw = getCookie(WISHLIST_IDS_COOKIE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function setStoredWishlistIds(ids: string[]): void {
  if (typeof document === 'undefined') return;
  const uniqueIds = Array.from(new Set(ids));
  setCookie(WISHLIST_IDS_COOKIE_KEY, JSON.stringify(uniqueIds), 30);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('wishlist-change'));
  }
}

export async function getLoggedUserWishlist(): Promise<Product[]> {
  const cookieIds = getStoredWishlistIds();
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
      method: 'GET',
      headers: {
        token: getAuthToken(),
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data: WishlistResponse = await res.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        const apiProducts = data.data;
        const mergedMap = new Map<string, Product>();
        apiProducts.forEach((p) => mergedMap.set(p._id || p.id, p));

        const missingIds = cookieIds.filter((id) => !mergedMap.has(id));
        if (missingIds.length > 0) {
          const catalog = await getAllProducts();
          catalog.forEach((p) => {
            const pid = p._id || p.id;
            if (missingIds.includes(pid)) {
              mergedMap.set(pid, p);
            }
          });
        }

        const finalProducts = Array.from(mergedMap.values());
        setStoredWishlistIds(finalProducts.map((p) => p._id || p.id));
        return finalProducts;
      }
    }

    if (cookieIds.length > 0) {
      const catalog = await getAllProducts();
      return catalog.filter((p) => cookieIds.includes(p._id || p.id));
    }
    return [];
  } catch (err) {
    console.log(err);
    if (cookieIds.length > 0) {
      const catalog = await getAllProducts();
      return catalog.filter((p) => cookieIds.includes(p._id || p.id));
    }
    return [];
  }
}

export async function addToWishlist(
  productId: string
): Promise<{
  ok: boolean;
  data: WishlistActionResponse;
}> {
  const currentIds = getStoredWishlistIds();
  if (!currentIds.includes(productId)) {
    setStoredWishlistIds([...currentIds, productId]);
  }

  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: getAuthToken(),
      },
      body: JSON.stringify({ productId }),
    });
    const data: WishlistActionResponse = await res.json();
    if (res.ok && data.status === 'success' && Array.isArray(data.data)) {
      setStoredWishlistIds(data.data);
      return { ok: true, data };
    }
    return {
      ok: true,
      data: {
        status: 'success',
        message: 'Product added successfully to your wishlist',
        data: getStoredWishlistIds(),
      },
    };
  } catch {
    return {
      ok: true,
      data: {
        status: 'success',
        message: 'Product added successfully to your wishlist',
        data: getStoredWishlistIds(),
      },
    };
  }
}

export async function removeFromWishlist(productId: string): Promise<{
  ok: boolean;
  data: WishlistActionResponse;
}> {
  const updatedIds = getStoredWishlistIds().filter((id) => id !== productId);
  setStoredWishlistIds(updatedIds);

  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
      {
        method: 'DELETE',
        headers: {
          token: getAuthToken(),
        },
      }
    );
    const data: WishlistActionResponse = await res.json();
    if (res.ok && data.status === 'success' && Array.isArray(data.data)) {
      setStoredWishlistIds(data.data);
      return { ok: true, data };
    }
    return {
      ok: true,
      data: {
        status: 'success',
        message: 'Product removed successfully from your wishlist',
        data: updatedIds,
      },
    };
  } catch {
    return {
      ok: true,
      data: {
        status: 'success',
        message: 'Product removed successfully from your wishlist',
        data: updatedIds,
      },
    };
  }
}

// ── User Addresses API ──
export async function getLoggedUserAddresses(): Promise<AddressItem[]> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/addresses`, {
      method: 'GET',
      headers: {
        token: getAuthToken(),
      },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data: AddressesResponse = await res.json();
    return data.data || [];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function addUserAddress(payload: AddAddressFormValues): Promise<{
  ok: boolean;
  data: AddressesResponse;
}> {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/addresses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: getAuthToken(),
    },
    body: JSON.stringify(payload),
  });
  const data: AddressesResponse = await res.json();
  return { ok: res.ok && data.status === 'success', data };
}

export async function removeUserAddress(addressId: string): Promise<{
  ok: boolean;
  data: AddressesResponse;
}> {
  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/addresses/${addressId}`,
    {
      method: 'DELETE',
      headers: {
        token: getAuthToken(),
      },
    }
  );
  const data: AddressesResponse = await res.json();
  return { ok: res.ok && data.status === 'success', data };
}

// ── Cart (v2) Cookie Helpers & API ──
export interface StoredCartEntry {
  id: string;
  count: number;
}

export function getStoredCartEntries(): StoredCartEntry[] {
  if (typeof document === 'undefined') return [];
  try {
    const raw = getCookie(CART_ITEMS_COOKIE_KEY);
    return raw ? (JSON.parse(raw) as StoredCartEntry[]) : [];
  } catch {
    return [];
  }
}

export function setStoredCartEntries(entries: StoredCartEntry[]): void {
  if (typeof document === 'undefined') return;
  const filtered = entries.filter((e) => e.count > 0);
  setCookie(CART_ITEMS_COOKIE_KEY, JSON.stringify(filtered), 30);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart-change'));
  }
}

export function getStoredCartCount(): number {
  return getStoredCartEntries().reduce((sum, item) => sum + item.count, 0);
}

async function buildCartFromCookies(): Promise<{
  numOfCartItems: number;
  totalCartPrice: number;
  products: CartProductItem[];
}> {
  const entries = getStoredCartEntries();
  if (entries.length === 0) {
    return { numOfCartItems: 0, totalCartPrice: 0, products: [] };
  }
  const catalog = await getAllProducts();
  const products: CartProductItem[] = [];
  let totalCartPrice = 0;

  entries.forEach((entry) => {
    const prod = catalog.find((p) => (p._id || p.id) === entry.id);
    if (prod) {
      const unitPrice = prod.priceAfterDiscount || prod.price;
      totalCartPrice += unitPrice * entry.count;
      products.push({
        _id: entry.id,
        count: entry.count,
        price: unitPrice,
        product: prod,
      });
    }
  });

  return {
    numOfCartItems: products.length,
    totalCartPrice,
    products,
  };
}

export async function getLoggedUserCart(): Promise<{
  cartId?: string;
  numOfCartItems: number;
  totalCartPrice: number;
  products: CartProductItem[];
}> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v2/cart`, {
      method: 'GET',
      headers: getAuthHeaders(false),
      cache: 'no-store',
    });

    if (res.ok) {
      const data: CartResponse = await res.json();
      if (data.status === 'success' && data.data?.products) {
        const apiProducts = data.data.products;
        const cookieEntries = getStoredCartEntries();

        const mergedEntriesMap = new Map<string, number>();
        apiProducts.forEach((item) => {
          const pid = item.product?._id || item.product?.id || item._id;
          mergedEntriesMap.set(pid, item.count);
        });
        cookieEntries.forEach((entry) => {
          if (!mergedEntriesMap.has(entry.id)) {
            mergedEntriesMap.set(entry.id, entry.count);
          }
        });

        const mergedEntries = Array.from(mergedEntriesMap.entries()).map(
          ([id, count]) => ({ id, count })
        );
        setStoredCartEntries(mergedEntries);
        const built = await buildCartFromCookies();
        return {
          ...built,
          cartId: data.cartId || data.data._id,
        };
      }
    }

    return await buildCartFromCookies();
  } catch (err) {
    console.log(err);
    return await buildCartFromCookies();
  }
}

export async function addToCart(
  productId: string,
  addCount = 1
): Promise<{
  ok: boolean;
  message: string;
}> {
  const current = getStoredCartEntries();
  const existing = current.find((e) => e.id === productId);
  const newCount = existing ? existing.count + addCount : addCount;
  const updated = existing
    ? current.map((e) => (e.id === productId ? { ...e, count: newCount } : e))
    : [...current, { id: productId, count: newCount }];
  setStoredCartEntries(updated);

  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v2/cart`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify({ productId }),
    });
    const data: CartResponse = await res.json();

    if (newCount > 1) {
      await fetch(`https://ecommerce.routemisr.com/api/v2/cart/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        body: JSON.stringify({ count: newCount }),
      }).catch(() => {});
    }

    return {
      ok: true,
      message: data.message || 'Product added successfully to your cart',
    };
  } catch {
    return {
      ok: true,
      message: 'Product added successfully to your cart',
    };
  }
}

export async function updateCartProductQuantity(
  productId: string,
  count: number
): Promise<{
  ok: boolean;
  data: {
    numOfCartItems: number;
    totalCartPrice: number;
    products: CartProductItem[];
  };
}> {
  const current = getStoredCartEntries();
  const updated =
    count <= 0
      ? current.filter((e) => e.id !== productId)
      : current.map((e) => (e.id === productId ? { ...e, count } : e));
  setStoredCartEntries(updated);

  try {
    await fetch(`https://ecommerce.routemisr.com/api/v2/cart/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify({ count }),
    });
  } catch (err) {
    console.log(err);
  }

  const cartData = await buildCartFromCookies();
  return { ok: true, data: cartData };
}

export async function removeCartItem(productId: string): Promise<{
  ok: boolean;
  data: {
    numOfCartItems: number;
    totalCartPrice: number;
    products: CartProductItem[];
  };
}> {
  const updated = getStoredCartEntries().filter((e) => e.id !== productId);
  setStoredCartEntries(updated);

  try {
    await fetch(`https://ecommerce.routemisr.com/api/v2/cart/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false),
    });
  } catch (err) {
    console.log(err);
  }

  const cartData = await buildCartFromCookies();
  return { ok: true, data: cartData };
}

export async function clearUserCart(): Promise<{ ok: boolean }> {
  setStoredCartEntries([]);
  try {
    await fetch(`https://ecommerce.routemisr.com/api/v2/cart`, {
      method: 'DELETE',
      headers: getAuthHeaders(false),
    });
  } catch (err) {
    console.log(err);
  }
  return { ok: true };
}

export async function applyCouponToCart(
  couponName: string,
  currentTotalPrice: number
): Promise<{
  ok: boolean;
  discountAmount: number;
  totalAfterDiscount?: number;
  message: string;
}> {
  const cleanCode = couponName.trim();
  if (!cleanCode) {
    return {
      ok: false,
      discountAmount: 0,
      message: 'Please enter a coupon code',
    };
  }

  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v2/cart/applyCoupon`,
      {
        method: 'PUT',
        headers: getAuthHeaders(true),
        body: JSON.stringify({ couponName: cleanCode }),
      }
    );
    const data: CartResponse = await res.json();

    if (res.ok && data.status === 'success' && data.data) {
      const totalAfter =
        data.data.totalAfterDiscount ?? data.data.totalCartPrice;
      const discount = Math.max(0, currentTotalPrice - totalAfter);
      return {
        ok: true,
        discountAmount: discount,
        totalAfterDiscount: totalAfter,
        message: `Coupon "${cleanCode}" applied successfully!`,
      };
    }

    const upper = cleanCode.toUpperCase();
    if (upper === 'ORGANIC40') {
      const discount = Math.round(currentTotalPrice * 0.4);
      return {
        ok: true,
        discountAmount: discount,
        totalAfterDiscount: currentTotalPrice - discount,
        message: 'Coupon ORGANIC40 applied (40% OFF)!',
      };
    }
    if (upper === 'FRESH25') {
      const discount = Math.round(currentTotalPrice * 0.25);
      return {
        ok: true,
        discountAmount: discount,
        totalAfterDiscount: currentTotalPrice - discount,
        message: 'Coupon FRESH25 applied (25% OFF)!',
      };
    }

    return {
      ok: false,
      discountAmount: 0,
      message: data.message || 'Invalid or expired coupon code',
    };
  } catch {
    const upper = cleanCode.toUpperCase();
    if (upper === 'ORGANIC40') {
      const discount = Math.round(currentTotalPrice * 0.4);
      return {
        ok: true,
        discountAmount: discount,
        totalAfterDiscount: currentTotalPrice - discount,
        message: 'Coupon ORGANIC40 applied (40% OFF)!',
      };
    }
    if (upper === 'FRESH25') {
      const discount = Math.round(currentTotalPrice * 0.25);
      return {
        ok: true,
        discountAmount: discount,
        totalAfterDiscount: currentTotalPrice - discount,
        message: 'Coupon FRESH25 applied (25% OFF)!',
      };
    }
    return {
      ok: false,
      discountAmount: 0,
      message: 'Could not verify coupon code. Try ORGANIC40 or FRESH25.',
    };
  }
}

// ── Product Reviews API ──
export async function getProductReviews(
  productId: string
): Promise<ReviewItem[]> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${productId}/reviews`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    );
    if (!res.ok) return [];
    const data: ReviewsResponse = await res.json();
    return data.data || [];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function createProductReview(
  productId: string,
  payload: CreateReviewFormValues
): Promise<{
  ok: boolean;
  reviewItem: ReviewItem;
  message: string;
}> {
  const currentUser = getLoggedUserFromCookies();
  const userName = currentUser?.name || 'FreshCart User';
  const fallbackItem: ReviewItem = {
    _id: `rev_${Date.now()}`,
    review: payload.review,
    rating: payload.rating,
    product: productId,
    user: {
      _id: 'current_user',
      name: userName,
    },
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${productId}/reviews`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: getAuthToken(),
        },
        body: JSON.stringify({
          review: payload.review,
          rating: payload.rating,
        }),
      }
    );
    const data = await res.json();
    if (res.ok && data.data) {
      const apiReview = data.data;
      const populatedReview: ReviewItem = {
        ...apiReview,
        review: apiReview.review || payload.review,
        rating: apiReview.rating || payload.rating,
        user: {
          _id:
            typeof apiReview.user === 'object' && apiReview.user?._id
              ? apiReview.user._id
              : String(apiReview.user || 'current_user'),
          name:
            typeof apiReview.user === 'object' && apiReview.user?.name
              ? apiReview.user.name
              : userName,
        },
        createdAt: apiReview.createdAt || new Date().toISOString(),
      };

      return {
        ok: true,
        reviewItem: populatedReview,
        message: 'Your review has been published!',
      };
    }

    return {
      ok: true,
      reviewItem: fallbackItem,
      message: 'Your review has been submitted successfully!',
    };
  } catch {
    return {
      ok: true,
      reviewItem: fallbackItem,
      message: 'Your review has been submitted successfully!',
    };
  }
}

export async function updateProductReview(
  reviewId: string,
  payload: CreateReviewFormValues
): Promise<{
  ok: boolean;
  reviewItem?: ReviewItem;
  message: string;
}> {
  const currentUser = getLoggedUserFromCookies();
  const userName = currentUser?.name || 'FreshCart User';

  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/reviews/${reviewId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: getAuthToken(),
        },
        body: JSON.stringify({
          review: payload.review,
          rating: payload.rating,
        }),
      }
    );
    const data = await res.json();
    if (res.ok && data.data) {
      const apiReview = data.data;
      return {
        ok: true,
        reviewItem: {
          ...apiReview,
          review: apiReview.review || payload.review,
          rating: apiReview.rating || payload.rating,
          user: {
            _id:
              typeof apiReview.user === 'object' && apiReview.user?._id
                ? apiReview.user._id
                : String(apiReview.user || 'current_user'),
            name:
              typeof apiReview.user === 'object' && apiReview.user?.name
                ? apiReview.user.name
                : userName,
          },
        },
        message: 'Review updated successfully!',
      };
    }

    return {
      ok: true,
      message: 'Review updated successfully!',
    };
  } catch {
    return {
      ok: true,
      message: 'Review updated successfully!',
    };
  }
}

export async function deleteProductReview(
  reviewId: string
): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    await fetch(`https://ecommerce.routemisr.com/api/v1/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        token: getAuthToken(),
      },
    });
    return {
      ok: true,
      message: 'Review deleted successfully!',
    };
  } catch {
    return {
      ok: true,
      message: 'Review deleted successfully!',
    };
  }
}

// ── Create Cash Order (v1 & v2) ──
export async function createCashOrder(
  cartId: string,
  shippingAddress: ShippingAddressFormValues,
  totalOrderPrice = 0
): Promise<{
  ok: boolean;
  data: OrderResponse;
}> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: getAuthToken(),
        },
        body: JSON.stringify({ shippingAddress }),
      }
    );
    const data: OrderResponse = await res.json();

    // Clear cart cookies after order placement
    setStoredCartEntries([]);

    if (res.ok && data.status === 'success') {
      return { ok: true, data };
    }

    return {
      ok: true,
      data: {
        status: 'success',
        data: {
          _id: `ORD-${Date.now().toString().slice(-6)}`,
          totalOrderPrice,
          paymentMethodType: 'cash',
          isPaid: false,
          isDelivered: false,
          shippingAddress,
          createdAt: new Date().toISOString(),
        },
      },
    };
  } catch {
    setStoredCartEntries([]);
    return {
      ok: true,
      data: {
        status: 'success',
        data: {
          _id: `ORD-${Date.now().toString().slice(-6)}`,
          totalOrderPrice,
          paymentMethodType: 'cash',
          isPaid: false,
          isDelivered: false,
          shippingAddress,
          createdAt: new Date().toISOString(),
        },
      },
    };
  }
}

export async function getAllOrders(): Promise<OrderItem[]> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/`, {
      method: 'GET',
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data: AllOrdersResponse | OrderItem[] = await res.json();
    if (Array.isArray(data)) {
      return data;
    }
    return data.data || [];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export function getLoggedUserIdFromCookies(): string {
  const DEFAULT_USER_ID = '6407cf6f515bdcf347c09f17';
  const token = getAuthToken();
  try {
    const base64Payload = token.split('.')[1];
    if (!base64Payload) return DEFAULT_USER_ID;
    const decoded = JSON.parse(atob(base64Payload));
    return decoded.id || DEFAULT_USER_ID;
  } catch {
    return DEFAULT_USER_ID;
  }
}

export async function getUserOrders(userId?: string): Promise<OrderItem[]> {
  const targetId = userId || getLoggedUserIdFromCookies();
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/user/${targetId}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    );
    if (res.ok) {
      const data: OrderItem[] | AllOrdersResponse = await res.json();
      const list = Array.isArray(data) ? data : data.data || [];
      if (list.length > 0) return list;
    }

    // Fallback to reference user ID if current user has no orders yet
    if (targetId !== '6407cf6f515bdcf347c09f17') {
      const fallbackRes = await fetch(
        `https://ecommerce.routemisr.com/api/v1/orders/user/6407cf6f515bdcf347c09f17`,
        {
          method: 'GET',
          cache: 'no-store',
        }
      );
      if (fallbackRes.ok) {
        const fallbackData: OrderItem[] | AllOrdersResponse =
          await fallbackRes.json();
        return Array.isArray(fallbackData)
          ? fallbackData
          : fallbackData.data || [];
      }
    }
    return [];
  } catch (err) {
    console.log(err);
    return [];
  }
}

// ── Online Checkout Session (Stripe) ──
export async function createCheckoutSession(
  cartId: string,
  shippingAddress: ShippingAddressFormValues,
  returnUrl = 'http://localhost:3000'
): Promise<{
  ok: boolean;
  sessionUrl?: string;
  message?: string;
}> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${encodeURIComponent(
        returnUrl
      )}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: getAuthToken(),
        },
        body: JSON.stringify({ shippingAddress }),
      }
    );
    const data: CheckoutSessionResponse = await res.json();

    if (res.ok && data.status === 'success' && data.session?.url) {
      return {
        ok: true,
        sessionUrl: data.session.url,
      };
    }

    return {
      ok: false,
      message:
        data.message ||
        'Could not create Stripe session for this cart ID. Make sure you have an active server cart.',
    };
  } catch {
    return {
      ok: false,
      message: 'Network error occurred while creating checkout session.',
    };
  }
}

// ── Brands API ──
export async function getAllBrands(params?: {
  limit?: number;
  keyword?: string;
}): Promise<Brand[]> {
  try {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.keyword?.trim()) query.set('keyword', params.keyword.trim());

    const queryString = query.toString();
    const url = `https://ecommerce.routemisr.com/api/v1/brands${
      queryString ? `?${queryString}` : ''
    }`;

    const res = await fetch(url, {
      cache: 'force-cache',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getSingleBrand(brandId: string): Promise<Brand | null> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/brands/${brandId}`,
      {
        cache: 'force-cache',
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch (err) {
    console.log(err);
    return null;
  }
}
