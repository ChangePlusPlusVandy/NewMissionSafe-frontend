import React, { useState } from 'react';
import { yupResolver } from 'mantine-form-yup-resolver';
import * as Yup from "yup";
import { Button, TextInput, Text, Flex, Paper, Title, Space, RadioGroup, Radio, Stack } from '@mantine/core';
import { createAndAddResponseToForm } from '../../utils/formInterface';
import { useForm } from '@mantine/form';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router';
import { responseType } from '../../utils/models/formModel';
import { ScrollArea } from '@mantine/core';
import { checkPolicy } from './FormUtils/CheckUtils';

const schema = Yup.object().shape({
    reasonForCheck: Yup.string().required("Reason for check is required"),
    checkAmount: Yup.string().required("Amount for check is required"),
    dateNeeded: Yup.string().required("Date Needed is required"),
    payableTo: Yup.string().required("Make Payable To is required"),
    businessAddress: Yup.string(),
    disbursalMethod: Yup.string().required("Disbursal Method is required"),
    requesterName: Yup.string().required("Full Name is required"),
    requesterEmail: Yup.string().email("Invalid Email format").required("Email is required"),
    signature: Yup.string().required("Signature is required")
})

const CheckRequestForm: React.FC<{ formID: string }> = ({ formID }) => {
    const {currentUser} = useAuth();
    const navigate = useNavigate();
    const [disbursalMethodOther,setDisbursalMethodOther] = useState("")

    const submit = async (values: any) => {
        //Handle free text for disbursal method
        if (values.disbursalMethod == "Other"){
            values.disbursalMethod = disbursalMethodOther;
        }
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
            console.error("Error submitting Check Request")
            console.error(error);
        }
    }
    const form = useForm({
        initialValues: {
            reasonForCheck: '',
            checkAmount: '',
            dateNeeded: '',
            payableTo: '',
            businessAddress: '',
            disbursalMethod: '',
            requesterName: '',
            requesterEmail: '',
            signature: ''
        }, validate: yupResolver(schema)
    })
    return (
        <ScrollArea bg={"missionSafeBlue.9"} w={"100%"} h={"100%"} pl={40} pr={40}>
            <Space h="xl">
                <Title order={2} fw={700} c="#5f737d"  style={{ marginBottom: 20 }}>
                    Check Request
                </Title>
                <Paper w={"70%"} bg={"missionSafeBlue.9"}>
                    <Flex direction="column"
                        gap={5}>
                        <form onSubmit={form.onSubmit(submit, console.log)}>
                            <TextInput
                                label="Reason for Check"
                                styles={{ label: { color: 'white' } }}
                                {...form.getInputProps("reasonForCheck")}
                                required
                            />
                            <TextInput
                                type="number"
                                label="Check Amount"
                                styles={{ label: { color: 'white' } }}
                                {...form.getInputProps("checkAmount")}
                                required
                            />
                            <TextInput
                                type="date"
                                label="Date Check Is Needed"
                                styles={{ label: { color: 'white' } }}
                                {...form.getInputProps("dateNeeded")}
                                required
                            />
                            <TextInput
                                label="Make Check Payable to"
                                styles={{ label: { color: 'white' } }}
                                {...form.getInputProps("payableTo")}
                                required
                            />
                            <TextInput
                                label="Business Address if Applicable"
                                styles={{ label: { color: 'white' } }}
                                {...form.getInputProps("businessAddress")}
                            />
                            <RadioGroup
                                style={{marginBottom:0}}
                                label="How would you like the check disbursed?"
                                {...form.getInputProps("disbursalMethod")}
                                styles={{ label: { color: 'white' } }}
                                required
                            >
                                <Stack>
                                    <Radio value="Mailed" label="Mailed" styles={{ label: { color: 'white' } }}/>
                                    <Radio value="In Person" label="In Person" styles={{ label: { color: 'white' } }}/>
                                    <Radio value="Emailed" label="Emailed" styles={{ label: { color: 'white' } }}/>
                                    <Radio value="Other" label="Other"styles={{ label: { color: 'white' } }} />
                                    {form.getInputProps("disbursalMethod")?.value === "Other" && (
                                        <TextInput
                                            label="Other Disbursal Method"
                                            placeholder="Enter other method"
                                            onChange= {(event) => setDisbursalMethodOther(event.target.value)}
                                            styles={{ label: { color: 'white' } }}
                                        />
                                    )}
                                </Stack>
                            </RadioGroup>
                            <TextInput
                                label="Check Requester Full Name"
                                styles={{ label: { color: 'white' } }}
                                {...form.getInputProps("requesterName")}
                                required
                            />
                            <TextInput
                                label="Check Requester Email"
                                styles={{ label: { color: 'white' } }}
                                {...form.getInputProps("requesterEmail")}
                                required
                            />
                            <Paper bg={"white"} style={{marginTop:20}}>
                                <Title order={2} fw={700}>Check Request Policy</Title>
                                <Text>{checkPolicy}</Text>
                            </Paper>

                            <TextInput
                            label="Print Name as Signature to Agree to above statement"
                            styles={{ label: { color: 'white' } }}
                                {...form.getInputProps("signature")}
                                required
                                />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Flex>
                </Paper>
            </Space>
        </ScrollArea>
    )
}
export default CheckRequestForm;