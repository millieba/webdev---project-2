import { useEffect, useState } from "react";
import axios from "axios";
import IssuesViews from "../components/IssuesViews";

interface Props {
    accessToken: string;
    projectId: string;
}

function GetIssues({ accessToken, projectId }: Props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [responseData, setResponseData] = useState([]);
    let cleanedResults: { title: string; description: string; assignees: string; state: string; createdAt: string; }[] = [];

    const gitlabRepoLink = "https://gitlab.stud.idi.ntnu.no/api/v4/projects/" + projectId + "/issues" + "?pagination=keyset&per_page=1000";

    useEffect(() => {
        setError(null);
        setIsLoaded(false);
        const config = {
            headers: {
                'PRIVATE-TOKEN': accessToken
            }
        };
        axios.get(gitlabRepoLink, config)
            .then(
                (result) => {
                    console.log(result);
                    let data = result.data;
                    setIsLoaded(true);
                    setResponseData(data);
                })
            .catch((error) => {
                console.log(error);
                setIsLoaded(true);
                setError(error.response.data.message);
            })
    }, [accessToken, gitlabRepoLink])


    function cleanUpResponse(res: Array<any>) {
        res.map((result, i) => {
            let title = result?.title;
            let description = result?.description === null || result?.description === "" ? "No description" : result?.description;
            let createdAt = new Date(result?.created_at);
            let state = result?.state === "opened" ? "open" : "closed"; // prettier formatting

            let assigneeArr = result?.assignees;
            let assigneeNames = new Array<string>();
            assigneeArr.length === 0 ? assigneeNames.push("Unassigned") : (assigneeArr.map((assignee: any) => {
                assigneeNames.push(assignee?.name);
            }))


            let issueObj = { title: title, description: description.replace(/[\r\n]+/g, ""), createdAt: createdAt.toDateString(), 
            assignees: assigneeNames.toString(), state: (state[0].toUpperCase()+state.slice(1)) };
            cleanedResults.push(issueObj);
        })
    }

    if (error) {
        return (
            <div>
                <h3>An error occured: </h3>{error}
            </div>);
    }
    else if (!isLoaded) {
        return <div>Loading...</div>;
    }
    else {
        cleanUpResponse(responseData);

        return (
            <>
                <h3>Issues</h3>
                <IssuesViews cleanedResults={cleanedResults} />
            </>
        );
    }

}
export default GetIssues;