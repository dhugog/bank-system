import { NavLink, Outlet } from "react-router-dom";
import { useGetUserDetailsQuery } from "../../app/services/auth.service";

interface Props {
  permission?: string;
}

const ProtectedRoute = ({ permission }: Props) => {
  const { data: user, isFetching } = useGetUserDetailsQuery();

  const permissions = user?.roles
    .flatMap((role: any) => role.permissions)
    .map((permission: any) => permission.slug);

  if (
    !isFetching &&
    (!user || (permission && !permissions.includes(permission)))
  ) {
    return (
      <div className="unauthorized">
        <h1>Unauthorized :(</h1>
        <span>
          <NavLink to="/login">Login</NavLink> to gain access
        </span>
      </div>
    );
  }

  if (!isFetching) {
    return <Outlet />;
  }

  return <div>Loading...</div>;
};

export default ProtectedRoute;
