import React from 'react';
import { Text, View, ViewProps } from 'react-native';

import { styles } from './styles';

interface Props extends ViewProps {
  title:string,
  subtitle:string
}
/*
  If you want to change for example view styles, in addition to the orther
  properties that have in viewProps 
*/


export function Heading({title, subtitle, ...rest}:Props) {
  return (
    <View style={styles.container}{...rest}>
      <Text style={styles.title}>
        {title}
      </Text>
      <Text style={styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  ); 
}