import { memo, useCallback, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import ProblemList from "../components/ProblemList";
import { Route } from "react-router-dom";
import { RootState } from "../store/store";

export const PrivateRoute = memo(function PrivateRoute(): React.ReactElement {
  const { isAuthenticated } = useAuth();

  const dispatch = useDispatch();

  const broadcast = useMemo(() => {
    return new BroadcastChannel("test_channel");
  }, []);

  useEffect(() => {
    const bc = new BroadcastChannel("test_channel");
    if (bc) {
      bc.onmessage = (payload: any) => {
        console.log(payload.data);
        dispatch(setUser({ idToken: payload.data }));
      };
    }
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const idToken = params.get("id_token");

    if (!idToken) return;

    broadcast.postMessage(idToken);
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
    <ProblemList />
  ) : (
    <div className="w-screen h-screen">
      <div className="flex w-full p-4 justify-end">
        <button
          className="w-20 border-2 border-sky-500 rounded flex items-center justify-center"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
});

async function getAuthToken(code: string): Promise<string> {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append(
    "Authorization",
    "Basic MXJodWtjMmhsMTE4cmVqdWlzNGhmdGFyZjg6MXU0M3BiZ3ZiNDYyMm90cDk1aWwydGsxMmpjZ2JvbzU5MGE3a2ZhbmxsM2RqZmRqbjB0Mg=="
  );

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "authorization_code");
  urlencoded.append("client_id", "1rhukc2hl118rejuis4hftarf8");
  urlencoded.append("code", code);
  urlencoded.append("redirect_uri", "http://localhost:5173/auth-callback");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow" as RequestRedirect,
  };

  try {
    const response = await fetch(
      "https://n11744260-assignment2.auth.ap-southeast-2.amazoncognito.com/oauth2/token",
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log(result);
    return result.id_token;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default memo(function ProblemRoute(): React.ReactElement {
  const element = useMemo(() => {
    return <PrivateRoute />;
  }, []);

  return <Route path="/problems" element={element} />;
});
