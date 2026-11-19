export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Product {
  sold: number;
  images: string[];
  subcategory: Subcategory[];
  ratingsQuantity: number;
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  priceAfterDiscount?: number;
  discountPercentage?: number;
  availableColors: string[];
  imageCover: string;
  category: Category;
  brand: Brand;
  ratingsAverage: number;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export const promoItems = [
  {
    id: 1,
    gradientClass: "from-[#00b050] via-[#009e43] to-[#008738]",
    badgeIcon: "🔥",
    badgeText: "Deal of the Day",
    title: "Fresh Organic Fruits",
    description: "Get up to 40% off on selected organic fruits",
    discount: "40% OFF",
    couponCode: "ORGANIC40",
    buttonTextColorClass: "text-[#008738]",
    buttonHref: "/shop",
    buttonText: "Shop Now",
  },
  {
    id: 2,
    gradientClass: "from-[#ff7a18] via-[#ff5436] to-[#ff2a5f]",
    badgeIcon: "✨",
    badgeText: "New Arrivals",
    title: "Exotic Vegetables",
    description: "Discover our latest collection of premium vegetables",
    discount: "25% OFF",
    couponCode: "FRESH25",
    buttonTextColorClass: "text-[#ff5436]",
    buttonHref: "/shop",
    buttonText: "Explore Now",
  },
];

// ── Auth Types ──
export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface VerifyResetCodeFormValues {
  resetCode: string;
}

export interface ResetPasswordFormValues {
  email: string;
  newPassword: string;
}

export interface AuthUser {
  name: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  message: string;
  user?: AuthUser;
  token?: string;
  statusMsg?: string;
  errors?: {
    msg: string;
    param?: string;
    path?: string;
  };
}

export interface ForgotPasswordResponse {
  statusMsg: string;
  message: string;
}

export interface UserItem {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface UpdateProfileFormValues {
  name: string;
  email: string;
  phone: string;
}

export interface ChangePasswordFormValues {
  currentPassword: string;
  password: string;
  rePassword: string;
}

export interface WishlistResponse {
  status: string;
  count: number;
  data: Product[];
}

export interface WishlistActionResponse {
  status: string;
  message: string;
  data: string[];
}

export interface AddressItem {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface AddAddressFormValues {
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface AddressesResponse {
  status: string;
  message?: string;
  results?: number;
  data: AddressItem[];
}

export interface CartProductItem {
  count: number;
  _id: string;
  product: Product;
  price: number;
}

export interface CartData {
  _id: string;
  cartOwner?: string;
  products: CartProductItem[];
  totalCartPrice: number;
  totalAfterDiscount?: number;
}

export interface CartResponse {
  status: string;
  message?: string;
  numOfCartItems: number;
  cartId?: string;
  data: CartData;
}

export interface ReviewItem {
  _id: string;
  review: string;
  rating: number;
  product: string;
  user: {
    _id: string;
    name: string;
  };
  createdAt?: string;
}

export interface CreateReviewFormValues {
  review: string;
  rating: number;
}

export interface ReviewsResponse {
  results?: number;
  data: ReviewItem[];
}

export interface ShippingAddressFormValues {
  details: string;
  phone: string;
  city: string;
}

export interface OrderItem {
  _id: string;
  id?: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  shippingAddress?: ShippingAddressFormValues;
  user?: {
    _id?: string;
    name: string;
    email?: string;
    phone?: string;
  };
  cartItems?: CartProductItem[];
  createdAt?: string;
}

export interface OrderResponse {
  status: string;
  message?: string;
  data?: OrderItem;
}

export interface AllOrdersResponse {
  results?: number;
  data: OrderItem[];
}

export interface CheckoutSessionResponse {
  status: string;
  message?: string;
  session?: {
    url: string;
    success_url?: string;
    cancel_url?: string;
  };
}









