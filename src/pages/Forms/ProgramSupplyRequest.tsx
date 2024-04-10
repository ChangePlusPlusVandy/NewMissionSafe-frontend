import React, { useEffect, useState } from 'react';
import { yupResolver } from 'mantine-form-yup-resolver';
import * as Yup from "yup";
import { Button, TextInput, Group, Flex, Paper, Title, Space, RadioGroup, Radio, Select } from '@mantine/core';
import { createAndAddResponseToForm } from '../../utils/formInterface';
import { useForm } from '@mantine/form';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router';
import { responseType } from '../../utils/models/formModel';
import { getAllStaff } from "../../utils/staffInterface.tsx";
import { staffType } from '../../utils/models/staffModel.ts';
import { DateInput } from "@mantine/dates";
import { ScrollArea } from '@mantine/core';
import { programs } from './FormUtils/ProgramUtils.tsx';

const schema = Yup.object().shape({
    employeeRequesting: Yup.string().required("Employee Requesting is required"),
    programRequesting: Yup.string().required("Name of Program Requesting is required"),
    dateNeededBy: Yup.string().required("Date Needed By is required"),
    itemDescription1: Yup.string().required("At least one description is required"),
    itemQuantity1: Yup.number().min(1, "At least one quantity is required").required("At least one quantity is required"),
    itemCost1: Yup.number().required("At least one cost is required"),
    itemDescription2: Yup.string(),
    itemQuantity2: Yup.number(),
    itemCost2: Yup.number(),   
    itemDescription3: Yup.string(),
    itemQuantity3: Yup.number(),
    itemCost3: Yup.number(),   
    itemDescription4: Yup.string(),
    itemQuantity4: Yup.number(),
    itemCost4: Yup.number(),   
    itemDescription5: Yup.string(),
    itemQuantity5: Yup.number(),
    itemCost5: Yup.number(),     
});

interface formProps {
    formID: string;
    programs: string[];
}

const ProgramSupplyRequest: React.FC<{formID: string}> = ({ formID }) => {
    const [staff, setStaff] = useState([]);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            employeeRequesting: currentUser?.displayName,
            programRequesting: '',
            dateNeededBy: '',
            itemDescription1: '',
            itemQuantity1: 0,
            itemCost1: 0,
            itemDescription2: '',
            itemQuantity2: 0,
            itemCost2: 0,
            itemDescription3: '',
            itemQuantity3: 0,
            itemCost3: 0,
            itemDescription4: '',
            itemQuantity4: 0,
            itemCost4: 0,
            itemDescription5: '',
            itemQuantity5: 0,
            itemCost5: 0,
            totalCost: 0,
        }, validate: yupResolver(schema)
    })
    const submit = async (values: any) => {
        const totalCost = values.itemQuantity1 * values.itemCost1 +
        values.itemQuantity2 * values.itemCost2 +
        values.itemQuantity3 * values.itemCost3 +
        values.itemQuantity4 * values.itemCost4 +
        values.itemQuantity5 * values.itemCost5;
        values.totalCost = totalCost;

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
            console.error("Error submitting Program Supply Request Form")
        }
        
    }

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
        <ScrollArea bg={"missionSafeBlue.9"} w={"100%"} h={"100%"}  pl={40} pr={40}>
            <Space h="xl" />
            <Title order={2} fw={700} c="#5f737d" style={{ marginBottom: 20 }}>
                Program Supply Request
            </Title>
            <Paper w={"70%"} bg={"missionSafeBlue.9"}>
                <Flex
                    direction="column"
                    gap={5}
                >   
                    <form onSubmit={form.onSubmit(submit, console.log)} >
                        <Select
                            data={staff.map((staff: staffType) => {
                                return staff.firstName + " " + staff.lastName;
                            })}
                            value={staff.map((staff: staffType) => {
                                return staff.firebaseUID;
                            })}
                            {...form.getInputProps("employeeRequesting")}
                            label="Employee Requesting"
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
                            {...form.getInputProps("programRequesting")}
                            label="Name of Program Requesting"
                            styles={{ label: { color: 'white' } }}
                            searchable
                            required
                        />
                        <TextInput
                            type="date"
                            placeholder='MM-DD-YYYY'
                            label='Date Needed By'
                            styles={{ label: { color: 'white' } }}
                            required
                            {...form.getInputProps("dateNeededBy")}
                        />
                        <TextInput
                            label="Item #1 Description"
                            styles={{ label: { color: 'white' } }}
                            {...form.getInputProps("itemDescription1")}
                            required
                        />
                        <TextInput
                            type="number"
                            label="Item #1 Quantity"
                            styles={{ label: { color: 'white' } }}
                            {...form.getInputProps("itemQuantity1")}
                            required
                        />
                        <TextInput
                            type="number"
                            label="Item #1 Cost"
                            styles={{ label: { color: 'white' } }}
                            {...form.getInputProps("itemCost1")}
                            required
                        />

                        <TextInput
                            label="Item #2 Description"
                            styles={{ label: { color: 'white' } }}
                            {...form.getInputProps("itemDescription2")}
                        />
                        <TextInput
                            type="number"
                            label="Item #2 Quantity"
                            styles={{ label: { color: 'white' } }}
                            {...form.getInputProps("itemQuantity2")}
                        />
                        <TextInput
                            type="number"
                            label="Item #2 Cost"
                            styles={{ label: { color: 'white' } }}
                            {...form.getInputProps("itemCost2")}
                        />

                        <TextInput
                            label="Item #3 Description"
                            styles={{ label: { color: 'white' } }}
                            {...form.getInputProps("itemDescription3")}
                        />
                        <TextInput
                            type="number"
                            label="Item #3 Quantity"
                            styles={{ label: { color: 'white' } }}
                            {...form.getInputProps("itemQuantity3")}
                        />
                        <TextInput
                            type="number"
                            label="Item #3 Cost"
                            styles={{ label: { color: 'white' } }}
                            {...form.getInputProps("itemCost3")}
                        />

                        <TextInput
                            label="Item #4 Description"
                            styles={{ label: { color: 'white' } }}
                            {...form.getInputProps("itemDescription4")}
                        />
                        <TextInput
                            type="number"
                            label="Item #4 Quantity"
                            styles={{ label: { color: 'white' } }}
                            {...form.getInputProps("itemQuantity4")}
                        />
                        <TextInput
                            type="number"
                            label="Item #4 Cost"
                            styles={{ label: { color: 'white' } }}
                            {...form.getInputProps("itemCost4")}
                        />

                        <TextInput
                            label="Item #5 Description"
                            styles={{ label: { color: 'white' } }}
                            {...form.getInputProps("itemDescription5")}
                        />
                        <TextInput
                            type="number"
                            label="Item #5 Quantity"
                            styles={{ label: { color: 'white' } }}
                            {...form.getInputProps("itemQuantity5")}
                        />
                        <TextInput
                            type="number"
                            label="Item #5 Cost"
                            styles={{ label: { color: 'white' } }}
                            {...form.getInputProps("itemCost5")}
                        />
                        <Group justify="flex-end" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                    </form>
                </Flex>
            </Paper>
        </ScrollArea>

    )
}
export default ProgramSupplyRequest;