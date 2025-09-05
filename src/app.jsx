import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"

const fetchIssues = (activeLabels) => {
  const labelsParam =
    activeLabels.length === 0
      ? ""
      : `?labels=${activeLabels.map((label) => label.name).join(",")}`

  return fetch(
    `https://api.github.com/repos/frontendbr/vagas/issues${labelsParam}`,
  )
    .then((res) => res.json())
    .then((data) => {
      return data.map((issue) => ({
        id: issue.id,
        state: issue.state,
        title: issue.title,
        createdAt: issue.created_at,
        author: { name: issue.user.login, avatar: issue.user.avatar_url },
        labels: issue.labels.map((label) => ({
          id: label.id,
          color: label.color,
          name: label.name,
        })),
        url: issue.html_url,
      }))
    })
}

const fetchLabels = () =>
  fetch(`https://api.github.com/repos/frontendbr/vagas/labels?per_page=100`)
    .then((res) => res.json())
    .then((data) => {
      return data.map((label) => ({
        id: label.id,
        name: label.name,
        color: label.color,
      }))
    })

const fetchSearchedIssues = ({ searchTerm, searchTerm }) => {
  const labels = activeLabels.length > 0 ? `label:${activeLabels[0].name}` : ""
  const queryString =
    "?q=" +
    encodeURIComponent(
      `${searchTerm} repo:frontendbr/vagas is:issue is:open ${labels}`,
    )
  return fetch(`https://api.github.com/search/issues${queryString}`)
    .then((res) => res.json())
    .then((data) => ({
      totalCount: data.total_count,
      issues: data.items.map((issue) => ({
        id: issue.id,
        state: issue.state,
        title: issue.title,
        createdAt: issue.created_at,
        author: { username: issue.user.login, avatar: issue.user.avatar_url },
        labels: issue.labels.map((label) => ({
          id: label.id,
          color: label.color,
          name: label.name,
        })),
        url: issue.html_url,
      })),
    }))
}

const getFormattedDate = (date) => {
  const [year, month, day] = date.split("T")[0].split("-")
  return `${day}/${month}/${year}`
}

const Label = ({ isActive = false, label, onClickLabel }) => (
  <button
    onClick={() => onClickLabel(label)}
    className={`label ${isActive ? "activeLabel" : ""}`}
    style={{ backgroundColor: `#${label.color}` }}
  >
    {label.name}
  </button>
)

const IssueItem = ({
  state,
  title,
  createdAt,
  labels,
  author,
  url,
  onClickLabel,
}) => (
  <li>
    <span>{state}</span>
    <h3>
      <a href={url} target="_blank" rel="noreferrer">
        {title}
      </a>
    </h3>
    <div className="createdBy">
      <p>
        Criada em {getFormattedDate(createdAt)}, por {author.name}
      </p>
      <img src={author.avatar} alt={`Foto de ${author.name}`} />
    </div>
    {labels.length > 0 && (
      <p>
        Labels:
        {labels.map((label) => (
          <Label key={label.id} onClickLabel={onClickLabel} label={label} />
        ))}
      </p>
    )}
  </li>
)

const SearchIssues = ({
  formRef,
  searchedIssuesQuery,
  onSearchIssues,
  onClearSearchedIssues,
}) => (
  <div className="searchIssues">
    <form ref={formRef} onSubmit={onSearchIssues}>
      <input
        disabled={searchedIssuesQuery.isLoading}
        type="search"
        name="inputSearchIssues"
        className="inputSearchIssues"
        placeholder="React"
        minLength={2}
        required
        autoFocus
      />
      <button disabled={searchedIssuesQuery.isLoading}>Pesquisar</button>
    </form>
    {searchedIssuesQuery.data && (
      <button onClick={onClearSearchedIssues}>Limpar Pesquisa</button>
    )}
  </div>
)

const IssuesList = ({ activeLabels, onClickLabel }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const formRef = useRef(null)

  useEffect(() => {
    if (searchTerm.length > 0) {
      formRef.current.reset()
    }
  }, [searchTerm])

  const searchedIssuesQuery = useQuery({
    queryKey: ["searchedIssues", { searchTerm, activeLabels }],
    queryFn: () => fetchSearchedIssues({ searchTerm, activeLabels }),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: false,
    enabled: Boolean(searchTerm),
  })

  const issuesQuery = useQuery({
    queryKey: [
      "issues",
      { activeLabels: activeLabels.map(({ name }) => name) },
      activeLabels,
    ],
    queryFn: () => fetchIssues(activeLabels),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: false,
  })

  const searchIssues = (e) => {
    e.preventDefault()
    const { inputSearchIssues } = e.target.elements
    setSearchTerm(inputSearchIssues.value)
  }

  const clearSearchedIssues = () => setSearchTerm("")

  const isLoading = issuesQuery.isLoading || searchedIssuesQuery.isLoading
  const isError = issuesQuery.isError || searchedIssuesQuery.isError
  const errorMessage =
    issuesQuery.error?.message || searchedIssuesQuery.error?.message
  const titleMessage = `com o termo '${searchTerm}': ${searchedIssuesQuery.data?.totalCount}`
  const dataToRender = searchedIssuesQuery.isSuccess
    ? searchedIssuesQuery.data.issues
    : issuesQuery.data

  return (
    <div className="issuesListContainer">
      <h1>Vagas {searchedIssuesQuery.isSuccess && titleMessage}</h1>
      <SearchIssues
        onSearchIssues={searchIssues}
        formRef={formRef}
        searchedIssuesQuery={searchedIssuesQuery}
        onClearSearchedIssues={clearSearchedIssues}
      />
      {isError && <p>{errorMessage}</p>}
      {isLoading && <p>Carregando Informações...</p>}
      <ul className="issuesList">
        {dataToRender?.map((issue) => (
          <IssueItem key={issue.id} onClickLabel={onClickLabel} {...issue} />
        ))}
      </ul>
    </div>
  )
}

const LabelsList = ({ activeLabels, onClickLabel }) => {
  const { isError, isSuccess, isLoading, data, error } = useQuery({
    queryKey: ["labels"],
    queryFn: () =>
      fetchLabels({ organization: "frontendbr", repository: "vagas" }),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
  return (
    <div className="labelsListContainer">
      <h2>Labels</h2>
      {isError && <p>{error.message}</p>}
      {isLoading && <p>Carregando Informações...</p>}
      {isSuccess && (
        <ul className="labelsList">
          {data.map((label) => (
            <Label
              key={label.id}
              isActive={activeLabels.some(
                (activeLabel) => label.id === activeLabel.id,
              )}
              label={label}
              activeLabel={activeLabels}
              onClickLabel={onClickLabel}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

const App = () => {
  const [activeLabels, setActiveLabels] = useState([])

  const markAsActive = (label) =>
    setActiveLabels((prev) => {
      const isAlreadyActive = prev.some(
        (prevLabel) => prevLabel.id === label.id,
      )

      return isAlreadyActive
        ? prev.filter((prevLabel) => prevLabel.id !== label.id)
        : [...prev, label]
    })
  return (
    <div className="app">
      <IssuesList activeLabels={activeLabels} onClickLabel={markAsActive} />
      <LabelsList activeLabels={activeLabels} onClickLabel={markAsActive} />
    </div>
  )
}

export { App }
