import { useState } from "react";

function Welcome() {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count + 1);
    };

    return (
        <div className="card">
            <h2>Welcome Component</h2>
            <p style={{ marginBottom: "16px" }}>Count: {count}</p>
            <button className="btn btn-primary" onClick={increment}>
                Increment
            </button>
        </div>
    );
}

export default Welcome;