import React from 'react'

import {FormErrorMessage} from "@chakra-ui/core";

function TextError (props) {
  return <FormErrorMessage {...props}>{props.children}</FormErrorMessage>

}

export default React.memo(TextError)
