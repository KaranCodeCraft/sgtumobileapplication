import ApiContext from "./ApiContext";

const ApiState = (props) => {
    const url = "abc"

  return (
    <ApiContext.Provider
      value={{
        url
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

export default ApiState;
