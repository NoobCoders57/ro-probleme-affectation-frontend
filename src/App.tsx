import './App.css'
import {InputForm, InputFormSubmitEvent} from "./components/InputForm.tsx";
import {solverService} from "./service/SolverService.ts";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";

function App() {
    const [jobId, setJobId] = useState<string>();

    const query = useQuery({
        queryKey: ["solverJob", jobId],
        queryFn: () => solverService.getJob(jobId as string),
        enabled: !!jobId,
        refetchInterval: (query) => query.state.data?.job.status == "IN_PROGRESS" ? 2000 : false,
    });

    const handleFormSubmit = async (e: InputFormSubmitEvent) => {
        const uuid = await solverService.launchJob(e.matrix, e.optimization === "MAX" ? e.optimization : "MIN");
        setJobId(uuid);
    };

    return (
        <>
            <InputForm onSubmit={handleFormSubmit}/>
            {}
            {(query.isLoading || (query.isSuccess && query.data?.job.status != "COMPLETED")) && (
                <div>Solving...</div>
            )}
            {(query.isSuccess && query.data?.job.status == "COMPLETED") && (
                <div>
                    <div>La valeur optimale est <strong>{query.data?.job.result?.optimalValue}</strong></div>
                    <div>L'affectation optimale est :
                        <ol>
                            {query.data?.job.result.solution.map(((value, i) => (<li key={i}>{value + 1}</li>)))}
                        </ol>
                    </div>
                </div>
            )}
        </>
    )
}

export default App
