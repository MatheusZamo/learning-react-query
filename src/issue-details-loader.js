const issueDetailsLoader = ({ params }) =>
  fetch(
    `https://api.github.com/repos/frontendbr/vagas/issues/${params.issueNumber}`,
  )

export { issueDetailsLoader }
