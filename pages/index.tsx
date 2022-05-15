import type { NextApiRequest, NextPage } from "next";

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  const ip = req.headers["x-real-ip"] || req.socket.remoteAddress;

  return {
    props: {
      ip,
    }, // will be passed to the page component as props
  };
}

const Home: NextPage<{ ip: string }> = (props) => {
  return <div>{props.ip}</div>;
};

export default Home;
