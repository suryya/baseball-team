import React,  {useCallback} from 'react';

import { Box, FormControl, Input, 
         Select , ButtonGroup, Button, SimpleGrid ,
         useToast , List , ListItem  , Flex, Heading} from "@chakra-ui/core";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {useTeamState, useTeamDispatch} from './teamContext';
import TextError from '../../components/TextError'
import * as Yup from 'yup'
import ACTIONS from './actionTypes';

const {ADD_MEMBER} = ACTIONS;

export default function ComposeQuarter() {
    const dispatch = useTeamDispatch()
    const {members,positionOptions} = useTeamState()
    const toast = useToast();

    let formInitValues = { fname:'' , 
                           lname:'' , 
                           height:'', 
                           position:'' }

    const checkUniqueMember = useCallback((values) => {
        let matched = members.filter((mem) => `${mem.fname}${mem.lname}` === `${values.fname}${values.lname}`);
        return (matched && matched.length)
    },[members])


    const validationSchema = React.useMemo(() => Yup.object({
        fname: Yup
          .string()
          .label('First name')
          .required()
          .test('is-alpha', 'First name should contain characters only', function(value) {
            return (/^[A-Za-z\s]+$/.test(value))
          })
          .test('unique-name', 'Name should be unique', function(value) {
            return !checkUniqueMember({fname:value,lname:this.parent.lname})
          }),
        lname: Yup
          .string()
          .label('Last name')
          .required()
          .test('is-alpha', 'Last name should contain characters only', function(value) {
            return (/^[A-Za-z\s]+$/.test(value))
          })
          .test('unique-name', 'Name should be unique', function(value) {
            return !checkUniqueMember({lname:value,fname:this.parent.fname})
          }),
        height: Yup
          .number()
          .typeError('Height must be a number')
          .label('Height')
          .required()
          .positive('should be a positive number'),
        position: Yup
          .string()
          .label('Position')
          .required()
    }),[checkUniqueMember]);

      

    const onSubmitMemberAdd = useCallback((values, actions) => {
        
            dispatch({type:ADD_MEMBER,payload:values})
            actions.resetForm({formInitValues})
            actions.setStatus({success: true})    
            toast({
                title: "Success",
                description: "Added team member successfully",
                status: "success",
                duration: 2000,
                position: "top-right",
                isClosable: true,
              })
            actions.setSubmitting(false);

    }, [dispatch,toast,formInitValues]);


    return (


            <Flex align="center">
                <Flex size="65%" align="center" justify="center">

                    <Box w="100%" h="10">
                        <Heading as="h4" size="md" p={4} >
                            Enter team member details
                        </Heading>
                        <Formik
                                initialValues={formInitValues}
                                onSubmit={onSubmitMemberAdd}
                                validationSchema={validationSchema}>
                                
                                {props => (
                                    <Form>
                                        <Box w="100%" p={4} >

                                        <SimpleGrid columns={1} spacing={10}>
                                            <Box height="40px">
                                                <Field name="fname" >
                                                        {({ field, form }) => (

                                                            <FormControl  isInvalid={form.errors.fname && form.touched.fname}>
                                                                <Input  {...field} type="text" id="f-name" aria-describedby="Enter first name"  
                                                                        placeholder="First Name"/>
                                                                <ErrorMessage id="first-name-helper-text" component={TextError} name="fname" />
                                                            </FormControl>

                                                        )}
                                                </Field>
                                            </Box>


                                            <Box height="40px">
                                                <Field name="lname">
                                                {({ field, form }) => (

                                                    <FormControl   isInvalid={form.errors.lname && form.touched.lname}>
                                                        <Input  {...field} type="text" id="l-name" aria-describedby="Enter last name"  
                                                            placeholder="Last Name"/>
                                                        <ErrorMessage id="last-name-helper-text" component={TextError} name="lname" />
                                                    </FormControl>

                                                )}
                                                </Field>
                                            </Box>

                                            <Box height="40px">
                                                <Field name="height">
                                                {({ field, form }) => (

                                                    <FormControl isInvalid={form.errors.height && form.touched.height}>
                                                        <Input  {...field} type="text" id="l-height" aria-describedby="Enter height in cm*"  
                                                                placeholder="Height in cm"/>
                                                        
                                                        <ErrorMessage id="height-helper-text" component={TextError} name="height" />
                                                    </FormControl>
                                                )}
                                                </Field>
                                            </Box>


                                            <Box height="40px">
                                                <Field name="position">
                                                {({ field, form }) => (
                                                        <FormControl   isInvalid={form.errors.position && form.touched.position}>
                                                        <Select  {...field} placeholder="Choose Position">
                                                            {positionOptions?.length && positionOptions.map(o => {
                                                                return <option key={o} value={o}>{o}</option>
                                                            })}
                                                        </Select>
                                                        <ErrorMessage id="email-helper-text" component={TextError} name="position" />
                                                        </FormControl>
                                                )}
                                                </Field>
                                            </Box>


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

                <Flex size="35%" align="center" justify="center">

                    <Box w="100%" h="10" p={8} > 
                            {(members.length > 0) && 
                                <>
                                    <Heading as="h4" size="md">
                                        List of existing team members
                                    </Heading>

                                    <List as="ol" styleType="decimal">
                                        {members?.map((member,i) => <ListItem key={`${i}`}>{member.fname} {member.lname}</ListItem>)}   
                                    </List>
                                </>
                            }
                    </Box>
                </Flex>
                
            </Flex>

    );
  }
