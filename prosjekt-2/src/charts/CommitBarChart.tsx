import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React from 'react';
import { ICommit } from "../api/GetCommits";

interface Props {
    cleanedResults: Array<ICommit>;
}

interface CommitDay {
    name: string;
}

class CommitsBarChart extends React.Component<Props>{

    getChartData() {
        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const sorter = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        let cleanedDay = new Array<CommitDay>;
        let dayCount: { name: string; count: number }[] = [];

        this.props.cleanedResults.map((result) => {
            const date = new Date(result.committedDate);
            const daysNamed = weekday[date.getDay()];
            let data = { name: daysNamed };
            cleanedDay.push(data);
        });

        cleanedDay.map((result) => {
            !dayCount.some(daysNamed => daysNamed.name === result.name) ?
                dayCount.push({ name: result.name, count: 1 }) // if never counted
                : dayCount[dayCount.map(a => a.name).indexOf(result.name)].count += 1 // if counted previously
        })

        // sorting the counted data from Monday to Sunday
        return dayCount.sort((a, b) => sorter.indexOf(a.name) - sorter.indexOf(b.name));
    }

    render() {
        return (
            <div style={{ width: "95%", height: 500 }}>
                <h3>Number of commits for each day in the week</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={this.getChartData()}
                        margin={{
                            top: 5,
                            right: 15,
                            left: 5,
                            bottom: 50,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip cursor={{ fill: 'rgb(220, 220, 220, 0.4)'}} />
                        <Legend />
                        <Bar name="commit amount" dataKey="count" fill="#C9A7D0" />
                    </BarChart>
                </ResponsiveContainer>
            </div >
        );
    }
}

export default CommitsBarChart;
