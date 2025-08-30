import { useQuery } from "@tanstack/react-query"

const fetchUser = (username) =>
  fetch(`https://api.github.com/users/${username}`).then((res) => res.json())

const GitHubUser = ({ username }) => {
  const { isError, error, isLoading, data } = useQuery({
    queryKey: [username],
    queryFn: () => fetchUser(username),
    refetchOnWindowFocus: false,
  })

  return isError ? (
    <p>{error.message}</p>
  ) : isLoading ? (
    <p>Carregando informações...</p>
  ) : (
    <ul>
      {Object.entries(data).map(([key, value]) => (
        <li key={key}>
          <b>{key}</b> : {value}
        </li>
      ))}
    </ul>
  )
}

const App = () => <GitHubUser username="MatheusZamo" />

export { App }
