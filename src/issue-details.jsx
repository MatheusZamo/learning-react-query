import { Link, useLoaderData } from "react-router"

const IssueDetails = () => {
  const data = useLoaderData()

  return (
    <>
      <Link to="/">Voltar</Link>
      <h2>{data.title}</h2>
      <p>{data.body}</p>
    </>
  )
}

export { IssueDetails }
