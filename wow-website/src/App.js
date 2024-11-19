// Importing modules
import React, { useState } from "react";
import "./App.css";
import RaiderIOService from "./services/RaiderIOService"

function App() {
    const [inputs, setInputs] = useState({
        region: "",
        realm: "",
        name: ""
    })
    
    const [rioData, setRioData] = useState({});

    const gearslots = [
        "back",
		"chest",
		"feet",
		"finger1",
		"finger2",
		"hands",
		"head",
		"legs",
		"mainhand",
		"neck",
		"offhand",
		"shirt",
		"shoulder",
		"trinket1",
		"trinket2",
		"waist",
		"wrist"
    ];

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchData = () => {
        RaiderIOService.getPlayerData(inputs.region, inputs.realm, inputs.name).then(setRioData);

        // TODO: BattleNet
        // TODO: Warcraft Logs
    };

    // TODO: Extract the Searchbar to a Component+Hook
    // TODO: Extract RaiderIO to a Component(+Hook?)
    // TODO: Extract BattleNet to a Component? (Merge it with RaiderIO for simplicity)
    // TODO: Extract Warcraft Logs to a Component+Hook

    // ! Doing the above will simplify the rendering since we can do it conditionally and contained in each component.

    return (
        <div className="App">
            <header className="App-header">
                <h1>RaiderIO Test</h1>
                <input
                    type="text"
                    name="region"
                    placeholder="Enter region"
                    value={inputs.region}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="realm"
                    placeholder="Enter realm"
                    value={inputs.realm}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={inputs.name}
                    onChange={handleInputChange}
                />
                <button className="btn" onClick={fetchData}>Fetch Data</button>

                {rioData["name"] ? (
                    <div>
                        <h2>Data from API:</h2>
                        <p>Name: {rioData.name}</p>
                        <p>Item Level: {rioData["gear"]["item_level_equipped"]}</p>
                        <p>Spec: {rioData["active_spec_name"]}</p>
                    </div>
                ) : <p>Awaiting Raider.IO Data... </p> }
            </header>
        </div>
    );
}

export default App;
