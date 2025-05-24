export interface UserInterface {
/// Long id, @NonNull String username, @NonNull String email, String firstName, String lastName, boolean isActive
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  role: 'USER' | 'ADMIN' | 'WORKER' | 'PRODUCT_MANAGER' | 'ACCOUNT_MANAGER' | 'OWNER';
}
