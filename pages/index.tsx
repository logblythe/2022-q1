import type { NextApiRequest, NextPage } from "next";

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  const ip = req.headers["x-real-ip"] || req.socket.remoteAddress;
  const browser = req.headers["user-agent"];

  return {
    props: {
      ip,
      browser,
    }, // will be passed to the page component as props
  };
}

const Home: NextPage<{ ip: string; browser: string }> = (props) => {
  return (
    <div>
      <div>{props.ip}</div>
      <div>{props.browser}</div>
    </div>
  );
};

export default Home;
