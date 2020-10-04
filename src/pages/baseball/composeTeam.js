import React,  {useCallback,useRef} from 'react';

import { Box, FormControl, Input, 
         ButtonGroup, Button, SimpleGrid ,
         useToast , List , ListItem  , Flex, Heading} from "@chakra-ui/core";
import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import {useTeamState, useTeamDispatch} from './teamContext';
import TextError from '../../components/TextError'
import Select from 'react-select';
import * as Yup from 'yup'
import ACTIONS from './actionTypes';

const {ADD_MEMBER} = ACTIONS;

const CustomSelect = ({ label, ...props }) => {

    const [field, meta, helpers] = useField(props);
    const { options } = props;
    const { touched, error, value } = meta;
    const { setValue } = helpers;  
    const {isMulti, placeholder} = props;


    const customStyles = React.useMemo(() => {
        return {
            control: (base, state) => ({
              ...base,
              borderRadius: (state.isFocused || error) ? "4px 4px 4px 4px" : 3,
              borderColor: (error ? "#e53e3e" :"#ccddee"),
              borderWidth: (error ? "2px" :"1px")
            })
          }
    },[error])


    return (
      <>
       <Select
        styles={customStyles} 
        isMulti={isMulti}
        placeholder={placeholder}
        options={options}
        value={field.value}
        name={field.name}
        onChange={(option) => setValue(option ?? [])}
        instanceId={props.iid}
      />
      </>
    );
  };
  


export default function ComposeQuarter() {
    
    //context updater handle
    const dispatch = useTeamDispatch()

    //Data fetched from context store
    const {members,positionOptions} = useTeamState()
    const toast = useToast();
    
    //Initialize object to represent the form structure 
    const formInitValues =  useRef({  fname:'' , 
                                lname:'' , 
                                height:'', 
                                position: [] });
                                
    //check the first and last name of the team member against the 
    //previously entered team members to ensure no duplicate names are entered
    const checkUniqueMember = useCallback((values) => {
        let matched = members.filter((mem) => (`${mem.fname}${mem.lname}`).toLowerCase() 
                                                === (`${values.fname}${values.lname}`).toLowerCase());
        return (matched && matched.length) ? false : true;
    },[members])

    //Yup form validation schema
    const validationSchema = React.useMemo(() => Yup.object({
        fname: Yup
          .string()
          .label('First name')
          .required()
          .test('is-alpha', 'First name should contain characters only', function(value) {
            return (/^[A-Za-z\s]+$/.test(value))
          })
          .test('unique-name', 'Name should be unique', function(value) {
            return checkUniqueMember({fname:value,lname:this.parent.lname})
          }),
        lname: Yup
          .string()
          .label('Last name')
          .required()
          .test('is-alpha', 'Last name should contain characters only', function(value) {
            return (/^[A-Za-z\s]+$/.test(value))
          })
          .test('unique-name', 'Name should be unique', function(value) {
            return checkUniqueMember({lname:value,fname:this.parent.fname})
          }),
        height: Yup
          .number()
          .typeError('Height must be a number')
          .label('Height')
          .required()
          .positive('should be a positive number'),
        position: Yup
           .array()
           .min(1, 'Choose at least one position')
           .of(
                Yup.object().shape({
                    value: Yup.string().required(),
                    label: Yup.string().required(),
                })
            )
          .label('Position')
    }),[checkUniqueMember]);


    const dropDownOptions = React.useMemo(() => {
        return positionOptions.map((val) => { 
            return {value: val, label: val}
        });
    },[positionOptions])


    //Form submit handler for adding new member to the list 
    const onSubmitMemberAdd = useCallback((values, actions) => {
                
            let formattedValues = {...values,
                                   ...{position:values.position.map((v) => v.value)}}
            //debugger
            dispatch({type:ADD_MEMBER,payload:formattedValues})
            actions.resetForm(formInitValues.current)
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
                                initialValues={formInitValues.current}
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
                                                        <CustomSelect name="position" isMulti {...field} placeholder="Choose Position" options={dropDownOptions}/>                                                            
                                                        <ErrorMessage id="email-helper-text" component={TextError} name="position" />
                                                        </FormControl>
                                                )}
                                                </Field>
                                            </Box>


                                            <Box height="70px">
                                                <FormControl >
                                                    <ButtonGroup spacing={4}>
                                                        <Button variantColor="gray" size="md" type="reset" onClick={() => props.resetForm(formInitValues.current)}>
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

               {/*This section is to display the list of members already added to the list*/}
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