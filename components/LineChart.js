import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import colors from '../constants/colors';

const MyLineChart = (props) => {

    let data = [...props.data]

    console.log(data.length)
    let condensedArr = [0]
    if(data.length >= 45){
        data.forEach((amount, i)=> {
            if(i % 10 == 0){
                condensedArr.push(amount)
            }
        })
        console.log(condensedArr)
    } else {
        condensedArr = [...data]
    }
    return (
        <View>
            <LineChart
                data={{
                    // labels: ["1m", "2m", "3m", "4m","5m", ],
                    datasets: [
                        {
                            data: condensedArr
                        }
                    ]
                }}
                width={Dimensions.get("window").width} // from react-native
                height={220}
                yAxisLabel="$"
                // yAxisSuffix="k"
                yAxisInterval={3} // optional, defaults to 1
                chartConfig={{
                    backgroundColor: colors.backgroundColor,
                    backgroundGradientFrom: colors.backgroundColor,
                    backgroundGradientTo: colors.backgroundColor,
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => colors.primaryColor,
                    labelColor: (opacity = 1) => 'gray',
                    style: {
                        borderRadius: 0,
                        fontWeight: 'bold',
                    },
                    propsForDots: {
                        r: "3",
                        strokeWidth: "1",
                        // stroke: "white"
                    }
                }}
                bezier
                style={{
                    marginVertical: 0,
                    borderRadius: 5,
                    // alignSelf: 'center'
                }}
            />
        </View>
    )
}

export default MyLineChart