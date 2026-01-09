import { useHelloWorld } from "./queries/queries";

function App() {
  const { loading, data } = useHelloWorld();

  return (
    <>
      {loading ? 'loading' : data}
    </>
  )
}

export default App
