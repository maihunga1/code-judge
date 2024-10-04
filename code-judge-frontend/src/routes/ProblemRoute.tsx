import {
  memo,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useAuth } from "../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import ProblemList from "../components/ProblemList";
import { Route } from "react-router-dom";
import { RootState } from "../store/store";
import { backendUrl } from "../api/api";

export const PrivateRoute = memo(function PrivateRoute({
  children,
}: PropsWithChildren): React.ReactElement {
  const dispatch = useDispatch();

  const broadcast = useMemo(() => {
    return new BroadcastChannel("test_channel");
  }, []);

  useEffect(() => {
    const bc = new BroadcastChannel("test_channel");
    if (bc) {
      bc.onmessage = (payload: any) => {
        console.log(payload.data);

        fetch(`${backendUrl}/user`, {
          headers: {
            Authorization: `Bearer ${payload.data}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            dispatch(setUser({ idToken: payload.data, userId: data.userID }));
          });
      };
    }
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    console.log("params", params);
    const accessToken = params.get("id_token");

    console.log(accessToken); // This will log the access token
    const code = params.get("id_token");

    if (!code) return;

    broadcast.postMessage(code);
    window.close();
  }, [broadcast]);

  const handleLogin = useCallback(() => {
    window.open(
      "https://n11744260-assignment2.auth.ap-southeast-2.amazoncognito.com/oauth2/authorize?client_id=1rhukc2hl118rejuis4hftarf8&response_type=token&scope=email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fproblems",
      "_blank"
    );
  }, []);

  const userToken = useSelector((state: RootState) => state.user.idToken);

  return !!userToken ? (
    <>{children}</>
  ) : (
    <div className="w-screen h-screen">
      <div className="flex w-full p-4 justify-end">
        {!userToken && (
          <button
            className="w-20 border-2 border-sky-500 rounded flex items-center justify-center"
            onClick={handleLogin}
        >
          Login
        </button>)}
      </div>
    </div>
  );
});
