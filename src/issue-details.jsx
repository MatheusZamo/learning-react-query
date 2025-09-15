import { parse } from "marked"
import DOMPurify from "dompurify"
import { Link, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { getIssueDetailsQuery } from "./issue-details-loader"

const IssueDetails = () => {
  const params = useParams()
  const issueDetailsQuery = useQuery({
    ...getIssueDetailsQuery(params.issueNumber),
  })

  return (
    <>
      <Link to="/">Voltar</Link>
      {issueDetailsQuery.isSuccess && (
        <>
          <h2>{issueDetailsQuery.data.title}</h2>
          <main
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(parse(issueDetailsQuery.data.body)),
            }}
          />
        </>
      )}
    </>
  )
}

export { IssueDetails }
