import { Button, Container, Form, Text } from 'native-base';
import * as React from 'react';
import { profileRootStyles } from '../style';
import { ProfileBody } from './profilebody';
import { ProfileGender } from './profilegender';

export interface Props {}
export interface State {}

export class ProfileRoot extends React.Component<Props, State> {
  render() {
    return (
      <Container>
        <Form style={profileRootStyles.titleGenderForm}>
          <Form style={profileRootStyles.form}>
            <Text style={profileRootStyles.formTxt}>내 정보</Text>
          </Form>
          <Form style={profileRootStyles.genderForm}>
            <ProfileGender />
          </Form>
        </Form>
        <Form>
          <ProfileBody />
        </Form>
        <Form style={profileRootStyles.btnForm}>
          <Form style={profileRootStyles.shadow}>
            <Button
              style={[profileRootStyles.button, profileRootStyles.saveBtnColor]}
            >
              <Text style={profileRootStyles.saveBtnText}>저장</Text>
            </Button>
          </Form>
          <Form style={[profileRootStyles.shadow, { height: 170 }]}>
            <Button
              style={[profileRootStyles.button, profileRootStyles.skipBtnColor]}
            >
              <Text style={profileRootStyles.skipBtnText}>SKIP</Text>
            </Button>
          </Form>
        </Form>
      </Container>
    );
  }
}