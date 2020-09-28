import React, { useEffect, useState , useCallback } from 'react';
import {Box, FormControl, Select , ButtonGroup, Button, SimpleGrid ,useToast, Heading, Flex } from "@chakra-ui/core";
import {useTeamState, useTeamDispatch} from './teamContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import TextError from '../../components/TextError'
import ACTIONS from './actionTypes';
const {CREATE_TEAM} = ACTIONS;

export default function ComposeTeam() {

    //context updater handle
    const dispatch = useTeamDispatch()

    //Data fetched from context store
    const {members,team,positionOptions} = useTeamState()

    const [users,setUsers] = useState([]);
    const toast = useToast();
    const [formInitValues,setFormInitValues] = useState({});
    

    //updates the form data container with the values from context store
    // based on positionOptions and team
    const restoreSavedValues = useCallback((team,positionOptions) => {
            
            let initValues = {users:positionOptions.map((p) => team?.[p] ?? ''), 
                              position:positionOptions.map((p) => team?.[p] ? p : '')}
            setFormInitValues(initValues)        
    },[])

    //forms the list of team members which will be shown as dropdown options
    useEffect(
        () => {
          let memberNames = members?.length && members.map(member => `${member.fname} ${member.lname}`);
          setUsers(memberNames)
        },
    [members]);

    //trigger restoreSavedValues when dependencies change
    useEffect(
        () => {
            restoreSavedValues(team,positionOptions)
        },
    [team,positionOptions,restoreSavedValues]);

    //Form submit handler , creates the JSON to be stored in context store and calls dispatch
    const onSubmitCreateTeam = useCallback((values, actions) => {

        let payload = values.position.reduce((acc,crr,i) => ({...acc,...{[crr]:values.users[i]}}) ,{});
        dispatch({type:CREATE_TEAM,payload})
        actions.setStatus({success: true})    
        toast({
            title: "Success",
            description: "Team successfully created",
            status: "success",
            duration: 2000,
            position: "top-right",
            isClosable: true,
            })
        actions.setSubmitting(false);

      }, [dispatch,toast]);

    //Validate slected team member as per the constraints
    const validatTeamMembers = useCallback((value,allValues,idx) => {
        let repeatedUsers = allValues.users.filter((user) => user && user === value).length > 1 ? true : false;
        let error;
        if (!value) {
          error = "Team Member is required";
        } else if (repeatedUsers && allValues.users[idx] === value) {
          error = "Team member can't be repeated";
        }else if(allValues.position[idx] && allValues.users[idx] === value){
            error = members.filter((member) => {
                return `${member.fname} ${member.lname}` === value && member.position === allValues.position[idx]
            })?.length === 0  ? 'Selcted user does not match the position' : undefined;  
        }        

        return error;
    },[members]);

    //Validate slected position as per the constraints
    const validatePosition = useCallback((value,allValues,idx) => {
        let repeatedPosition = allValues.position.filter((pos) => pos && pos === value).length > 1 ? true : false;
        let error;
        if (!value) {
          error = "Position is required";
        } else if (repeatedPosition && allValues.position[idx] === value) {
          error = "Position can't be repeated";
        }else if(allValues.users[idx] && allValues.position[idx] === value){
            error = members.filter((member) => {
                return `${member.position}` === value && `${member.fname} ${member.lname}` === allValues.users[idx]
            })?.length === 0  ? 'Selcted position does not match the user' : undefined;      
        }
        return error;
    },[members]);

    return (
        <Flex align="center">

            <Box w="70%"  h="10">

                        <Heading as="h4" size="md"  p={4} >
                            Compose bsae ball team
                        </Heading>
                        <Formik onSubmit={onSubmitCreateTeam} 
                                initialValues={formInitValues} 
                                enableReinitialize>
                            {props => (
                                <Form >
                                    <Box w="100%" p={4} >
                                    <SimpleGrid  columns={2} spacingX="40px"  spacingY="20px">
                                        {positionOptions?.length && positionOptions.map((pos,i) => {
                                            return (
                                            <React.Fragment key={pos}>
                                                <Box height="80px">
                                                    
                                                    <Field name={`users[${i}]`} validate={(value) => validatTeamMembers(value,props.values,i)}>
                                                        {({ field, form }) => (
                                                                <FormControl  isInvalid={form.errors?.users?.[i] && form.touched?.users?.[i]}>
                                                                <Select  {...field} placeholder="Choose Member">
                                                                    {users?.length && users.map(o => {
                                                                        return <option key={o} value={o}>{o}</option>
                                                                    })}
                                                                </Select>
                                                                <ErrorMessage component={TextError}name={`users[${i}]`} />
                                                                
                                                                </FormControl>
                                                        )}
                                                    </Field>
                                                </Box>

                                                <Box height="80px">
                                                    <Field  name={`position[${i}]`} validate={(value) => validatePosition(value,props.values,i)}>
                                                        {({ field, form }) => (
                                                                <FormControl   isInvalid={form.errors?.position?.[i] && form.touched?.position?.[i]}>
                                                                <Select  {...field} placeholder="Choose Position">
                                                                    {positionOptions?.length && positionOptions.map(o => {
                                                                        return <option key={o} value={o}>{o}</option>
                                                                    })}
                                                                </Select>
                                                                <ErrorMessage component={TextError}name={`position[${i}]`} />
                                                                
                                                                </FormControl>
                                                        )}
                                                    </Field>
                                                </Box>
                                            </React.Fragment>
                                        )})}

                                        <Box height="70px">
                                            <FormControl >
                                                <ButtonGroup spacing={4}>
                                                    <Button variantColor="gray" size="md" type="reset" onClick={() => props.resetForm(formInitValues)}>
                                                        Reset
                                                    </Button>
                                                    <Button variantColor="blue" size="md" isLoading={props.isSubmitting} type="submit">
                                                        Save
                                                    </Button>
                                                </ButtonGroup>
                                            </FormControl>
                                        </Box>

                                    </SimpleGrid>
                                    </Box>

                                </Form>
                            )}
                        </Formik>
            </Box>

        </Flex>

    );
  }
