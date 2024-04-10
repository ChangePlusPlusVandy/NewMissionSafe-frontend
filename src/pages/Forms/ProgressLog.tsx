import React, { useEffect, useState } from 'react';
import { yupResolver } from 'mantine-form-yup-resolver';
import * as Yup from "yup";
import { Button, Select, TextInput, Text, Group, Flex, Paper, Title, Space, Checkbox } from '@mantine/core';
import { createAndAddResponseToForm } from '../../utils/formInterface';
import { useForm } from '@mantine/form';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router';
import { responseType } from '../../utils/models/formModel';
import { getAllStaff } from "../../utils/staffInterface.tsx";
import { staffType } from '../../utils/models/staffModel.ts';
import { ScrollArea } from '@mantine/core';
import { CheckboxGroup } from '@mantine/core';

import {
    personalDevelopmentOptions, professionalDevelopmentOptions, educationalDevelopmentOptions, leadershipDevelopmentOptions,
    healthDevelopmentOptions, violencePreventionDevelopmentOptions, civicEngagementDevelopmentOptions, socialDevelopmentOptions
}
    from './FormUtils/ProgressUtils.tsx';
import { programs } from './FormUtils/ProgramUtils.tsx';

const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    participantFirstName: Yup.string().required("Participant First Name is required"),
    participantLastName: Yup.string().required("Participant Last Name is required"),
    associatedStaff: Yup.string().required("Associated Staff is required"),
    programName: Yup.string().required("Program Name is required"),
    engagementDate: Yup.string().required("Date of Engagement is required"),
    personalDevelopment: Yup.array(),
    profressionalDevelopment: Yup.array(),
    educationalDevelopment: Yup.array(),
    leadershipDevelopment: Yup.array(),
    healthDevelopment: Yup.array(),
    violencePreventionDevelopment: Yup.array(),
    civicEngagementDevelopment: Yup.array(),
    socialDevelopment: Yup.array(),
    otherService: Yup.string(),
    followUpType: Yup.string(),
    notes: Yup.string(),
    nextSteps: Yup.string(),
})

const followUpTypes = [
    "Home Visit",
    "In The Community",
    "School Visit",
    "Court Advocacy",
    "One on One",
    "In Program",
    "Phone",
    "Email",
    "Text",
    "Social Media"
]



const ProgressLog: React.FC<{formID: string}> = ({ formID }) => {
    const [staff, setStaff] = useState([]);
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const form = useForm({
        initialValues: {
            email: currentUser?.email || "",
            participantFirstName: '',
            participantLastName: '',
            associatedStaff: '',
            programName: '',
            engagementDate: '',
            personalDevelopment: [],
            professionalDevelopment: [],
            educationalDevelopment: [],
            leadershipDevelopment: [],
            healthDevelopment: [],
            violencePreventionDevelopment: [],
            civicEngagementDevelopment: [],
            socialDevelopment: [],
            otherService: '',
            followUpType: '',
            notes: '',
            nextSteps: '',
        }, validate: yupResolver(schema)
    })
    const submit = async (values: any) => {
        values.personalDevelopment = JSON.stringify(values.personalDevelopment)
        const responseFields: responseType = {
            responseID: crypto.randomUUID(),
            creatorID: currentUser?.uid || '',
            timestamp: new Date(),
            responses: Object.values(values)
        }

        try {
            const token = await currentUser?.getIdToken();
            if (!token) {
                navigate("/login")
            } else {
                await createAndAddResponseToForm(formID, responseFields, token)
                navigate("/forms")
            }
        }
        catch (error) {
            console.error("Error submitting Progress Log")
        }
    };

    useEffect(() => {
        const getStaff = async () => {
            const token = await currentUser?.getIdToken();
            if (token) {
                setStaff(await getAllStaff(token))
            } else {
                navigate("/login")
            }
        }
        getStaff();
    }, [currentUser]);


    return (
        <ScrollArea bg={"missionSafeBlue.9"} w={"100%"} h={"100%"} pl={40} pr={40}>
            <Space h="xl">
                <Title order={2} fw={700} c="#5f737d"  style={{ marginBottom: 20 }}>
                    Progress Log
                </Title>
                <Paper w={"70%"} bg={"missionSafeBlue.9"}>
                    <Flex
                        direction="column"
                        gap={5}>
                        <form onSubmit={form.onSubmit(submit, console.log)}>
                            <TextInput
                                label="Email"
                                styles={{ label: { color: 'white' } }}
                                placeholder='Your email'
                                {...form.getInputProps("email")}
                                required
                            />
                            <TextInput
                                label="Participant First Name"
                                styles={{ label: { color: 'white' } }}
                                {...form.getInputProps("participantFirstName")}
                                required
                            />
                            <TextInput
                                label="Participant Last Name"
                                styles={{ label: { color: 'white' } }}
                                {...form.getInputProps("participantLastName")}
                                required
                            />
                            <Select
                                data={staff.map((staff: staffType) => {
                                    return staff.firstName + " " + staff.lastName;
                                })}
                                value={staff.map((staff: staffType) => {
                                    return staff.firebaseUID;
                                })}
                                {...form.getInputProps("associatedStaff")}
                                label="Staffer Engaging with Participant"
                                styles={{ label: { color: 'white' } }}
                                searchable
                                required
                            />
                            <Select
                                data={programs.map((program: string) => {
                                    return program;
                                })}
                                value={programs.map((program: string) => {
                                    return program;
                                })}
                                {...form.getInputProps("programName")}
                                label="Name of Program Requesting"
                                styles={{ label: { color: 'white' } }}
                                searchable
                                required
                            />
                            <TextInput
                                type="date"
                                placeholder='MM-DD-YYYY'
                                label='Date of Engagement'
                                styles={{ label: { color: 'white' } }}
                                {...form.getInputProps("engagementDate")}
                                required
                            />
                            <CheckboxGroup
                                label="Assisted Youth In the following Personal Devlopment areas:"
                                styles={{ label: { color: '#5f737d', fontSize: "15pt", marginTop: 5 } }}
                                {...form.getInputProps("personalDevelopment")}
                            >
                                {personalDevelopmentOptions.map((option: string) => {
                                    return (
                                        <Group>
                                            <Checkbox value={option} />
                                            <Text c="white">{option}</Text>
                                        </Group>
                                    )
                                })}
                            </CheckboxGroup>
                            <CheckboxGroup
                                label="Assisted Youth In the following Professional Devlopment areas:"
                                styles={{ label: { color: '#5f737d', fontSize: "15pt", marginTop: 5 } }}
                                {...form.getInputProps("professionalDevelopment")}
                            >
                                {professionalDevelopmentOptions.map((option: string) => {
                                    return (
                                        <Group>
                                            <Checkbox value={option} />
                                            <Text c="white">{option}</Text>
                                        </Group>
                                    )
                                })}
                            </CheckboxGroup>
                            <CheckboxGroup
                                label="Assisted Youth In the following Educational Assistance areas:"
                                styles={{ label: { color: '#5f737d', fontSize: "15pt", marginTop: 5 } }}
                                {...form.getInputProps("educationalDevelopment")}
                            >
                                {educationalDevelopmentOptions.map((option: string) => {
                                    return (
                                        <Group>
                                            <Checkbox value={option} />
                                            <Text c="white">{option}</Text>
                                        </Group>
                                    )
                                })}
                            </CheckboxGroup>
                            <CheckboxGroup
                                label="Youth Participated In the Following Leadership Areas:"
                                styles={{ label: { color: '#5f737d', fontSize: "15pt", marginTop: 5 } }}
                                {...form.getInputProps("leadershipDevelopment")}
                            >
                                {leadershipDevelopmentOptions.map((option: string, index:  number) => {
                                    return (
                                        <Group>
                                            <Checkbox value={option} />
                                            <Text c="white">{option}</Text>
                                        </Group>
                                    )
                                })}
                            </CheckboxGroup>
                            <CheckboxGroup
                                label="Youth Participated In the Following Health & Wellness Areas:"
                                styles={{ label: { color: '#5f737d', fontSize: "15pt", marginTop: 5 } }}
                                {...form.getInputProps("healthDevelopment")}
                            >
                                {healthDevelopmentOptions.map((option: string) => {
                                    return (
                                        <Group>
                                            <Checkbox value={option} />
                                            <Text c="white">{option}</Text>
                                        </Group>
                                    )
                                })}
                            </CheckboxGroup>
                            <CheckboxGroup
                                label="Assisted Youth In the Following Violence Prevention Alternative Support Areas:"
                                styles={{ label: { color: '#5f737d', fontSize: "15pt", marginTop: 5 } }}
                                {...form.getInputProps("violencePreventionDevelopment")}
                            >
                                {violencePreventionDevelopmentOptions.map((option: string) => {
                                    return (
                                        <Group>
                                            <Checkbox value={option} />
                                            <Text c="white">{option}</Text>
                                        </Group>
                                    )
                                })}
                            </CheckboxGroup>
                            <CheckboxGroup
                                label="Youth Participated In the Following Civic Engagement Areas:"
                                styles={{ label: { color: '#5f737d', fontSize: "15pt", marginTop: 5 } }}
                                {...form.getInputProps("educationalDevelopment")}
                            >
                                {civicEngagementDevelopmentOptions.map((option: string) => {
                                    return (
                                        <Group>
                                            <Checkbox value={option} />
                                            <Text c="white">{option}</Text>
                                        </Group>
                                    )
                                })}
                            </CheckboxGroup>
                            <CheckboxGroup
                                label="Youth Improved or Needs to Improve in the Following Social Skill Areas:"
                                styles={{ label: { color: '#5f737d', fontSize: "15pt", marginTop: 5 } }}
                                {...form.getInputProps("socialDevelopment")}
                            >
                                {socialDevelopmentOptions.map((option: string) => {
                                    return (
                                        <Group>
                                            <Checkbox value={option} />
                                            <Text c="white">{option}</Text>
                                        </Group>
                                    )
                                })}
                            </CheckboxGroup>
                            <TextInput
                                label="Other Service if not listed above:"
                                styles={{ label: { color: 'white' } }}
                                {...form.getInputProps("otherService")}
                            />
                            <Select
                                data={followUpTypes}
                                label="Type of follow up"
                                styles={{ label: { color: 'white' } }}
                                {...form.getInputProps("followUpType")}
                                searchable
                            />
                            <TextInput
                                label="Notes from Engagement"
                                styles={{ label: { color: 'white' } }}
                                {...form.getInputProps("notes")}
                            />
                            <TextInput
                                label="Next Steps or Referrals Needed"
                                styles={{ label: { color: 'white' } }}
                                {...form.getInputProps("nextSteps")}
                            />
                            <Group  mt="md">
                                <Button type="submit">Submit</Button>
                            </Group>
                        </form>
                    </Flex>
                </Paper>
            </Space>
        </ScrollArea>
    )
}
export default ProgressLog;