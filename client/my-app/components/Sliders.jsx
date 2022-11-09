import React, { useState } from "react"
import { Text, Group, Button, Slider, createStyles, Center } from "@mantine/core"

export function Sliders({ sliderValues, setSliderValues }) {
    // const defaultSliderValues = Array(numberOfSliders).fill(0)
    const sliders = sliderValues.map((value, index) => {
        return (
            <Center>
                <Slider
                    key={index}
                    radius="xl"
                    mt="lg"
                    sx={{ width: "70%" }}
                    labelAlwaysOn
                    label={(val) => `${val}%`}
                    value={value}
                    color={sliderValues.reduce((a, b) => a + b) < 100 ? "red" : "blue"}
                    onChange={(value) => {
                        setSliderValues((oldSliderValues) => {
                            const newSliderValues = [...oldSliderValues]
                            newSliderValues[index] = value
                            const sumOfSliderValues = newSliderValues.reduce((a, b) => a + b, 0)
                            // setSliderValues such that the sum of all slider values is 100
                            if (sumOfSliderValues > 100) {
                                const difference = sumOfSliderValues - 100
                                newSliderValues[index] = value - difference
                            }
                            return newSliderValues
                            // if (sumOfSliderValues > 100) {
                            //     return oldSliderValues
                            // } else {
                            //     return newSliderValues
                            // }
                        })
                    }}
                />
            </Center>
        )
    })

    return <>{sliders}</>
}
