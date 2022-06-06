import React from "react";
import type { NextApiRequest, NextPage } from "next";
import { useUserAgent } from "next-useragent";
import { useCookies } from "react-cookie";
import geoip, { Lookup } from "geoip-lite";
import { parseCookies } from "../utils";
import Map from "../components/Map";
import { GoogleMap } from "@react-google-maps/api";

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  const cookie = parseCookies(req);

  const dynamicIp = req.headers["x-real-ip"] || req.socket.remoteAddress;
  const getIp = (): string | undefined => {
    if (!dynamicIp) return;
    if (typeof dynamicIp === "string") return dynamicIp;
    return dynamicIp[0];
  };
  const ip = getIp();
  const geo = ip ? geoip.lookup(ip) : undefined;

  const userAgent = req.headers["user-agent"];

  return {
    props: {
      geo,
      userAgent,
      cookie,
    }, // will be passed to the page component as props
  };
}

const Home: NextPage<{
  geo?: Lookup;
  userAgent: string;
  cookie: any;
}> = (props) => {
  const ua = useUserAgent(props.userAgent);
  const [_, setCookie] = useCookies(["user"]);
  if (!props.geo) return <div> no geo</div>;
  const { area, city, country, ll } = props.geo;

  if (props.cookie.user) {
    const count: number = Number(props.cookie.user) + 1;
    setCookie("user", JSON.stringify(count), {
      path: "/",
      maxAge: 60 * 60, // Expires after 1hr
      sameSite: true,
    });
  } else {
    setCookie("user", JSON.stringify(2), {
      path: "/",
      maxAge: 60 * 60, // Expires after 1hr
      sameSite: true,
    });
  }

  return (
    <div>
      <Map lat={ll[0]} lng={ll[1]} browser={ua.browser} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: 16,
          height: "4vh",
        }}
      >
        No. of visit: {props.cookie.user ?? 1}
      </div>
    </div>
  );

  return (
    <>
      <div>
        <div>
          Location:{city},{country}
        </div>
        <div>Browser: {ua.browser}</div>
        <div>No. of visit: {props.cookie.user ?? 1}</div>
        <Map lat={ll[0]} lng={ll[1]} browser={ua.browser} />
      </div>
    </>
  );
};

export default Home;
