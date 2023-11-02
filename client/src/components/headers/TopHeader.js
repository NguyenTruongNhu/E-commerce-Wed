import React, { memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import path from "ultils/path";
import { getCurrent } from "store/user/asyncActions";
import { useDispatch, useSelector } from "react-redux";
import icons from "ultils/icons";
import { logout, clearMessage } from "store/user/userSlice";
import Swal from "sweetalert2";

const { AiOutlineLogout } = icons;

const TopHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, current, mes } = useSelector((state) => state.user);

  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn) dispatch(getCurrent());
    }, 300);

    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [isLoggedIn, dispatch]);
  useEffect(() => {
    if (mes)
      Swal.fire("Oops!", mes, "info").then(() => {
        dispatch(clearMessage());
        navigate(`/${path.LOGIN}`);
      });
  });
  return (
    <div className="h-[38px] w-full bg-main flex justify-center items-center">
      <div className="w-main flex items-center justify-between text-xs text-white">
        <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
        {isLoggedIn && current ? (
          <div className="flex gap-4 text-sm items-center">
            <span>{`Welcome, ${current?.lastname} ${current?.firstname}`}</span>
            <span
              onClick={() => dispatch(logout())}
              className="hover:rounded-full hover:bg-gray-200 hover:text-main cursor-pointer p-2"
            >
              <AiOutlineLogout size={18} />
            </span>
          </div>
        ) : (
          <Link className="hover:text-gray-800" to={`/${path.LOGIN}`}>
            Sign In or Create Account
          </Link>
        )}
      </div>
    </div>
  );
};

export default memo(TopHeader);