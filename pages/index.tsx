import React from "react";
import type { NextApiRequest, NextPage } from "next";
import { useUserAgent } from "next-useragent";
import { useCookies } from "react-cookie";
import { parseCookies } from "../utils";

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  const cookie = parseCookies(req);

  const ip = req.headers["x-real-ip"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  return {
    props: {
      ip,
      userAgent,
      cookie,
    }, // will be passed to the page component as props
  };
}

const Home: NextPage<{
  ip: string;
  userAgent: string;
  cookie: any;
}> = (props) => {
  const ua = useUserAgent(props.userAgent);
  const [_, setCookie] = useCookies(["user"]);

  if (props.cookie.user) {
    const count: number = Number(props.cookie.user) + 1;
    setCookie("user", JSON.stringify(count), {
      path: "/",
      maxAge: 60 * 60, // Expires after 1hr
      sameSite: true,
      httpOnly: true,
    });
  } else {
    setCookie("user", JSON.stringify(2), {
      path: "/",
      maxAge: 60 * 60, // Expires after 1hr
      sameSite: true,
      httpOnly: true,
    });
  }

  return (
    <>
      <div>
        <div>IP: {props.ip}</div>
        <div>Browser: {ua.browser}</div>
        <div>No. of visit: {props.cookie.user ?? 1}</div>
      </div>
    </>
  );
};

export default Home;
