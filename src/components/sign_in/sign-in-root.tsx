import { Button, Container, Form, Text } from 'native-base';
import * as React from 'react';
import { loginbtn } from '../style';
import { EmailPassword } from './email-password';

export interface Props {
  navigation: any;
}
export interface State {}

export class SignIn extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <Container>
        <EmailPassword />
        <Form style={loginbtn.bottomLoginForm}>
          <Form style={loginbtn.shadowBtn}>
            <Button
              style={loginbtn.loginBtn}
              onPress={() => {
                this.props.navigation.navigate('MypageRoot');
              }}
            >
              <Text style={loginbtn.loginTextColor}>로그인</Text>
            </Button>
          </Form>
          <Form style={loginbtn.signupPasswordRow}>
            <Form>
              <Button
                transparent
                style={loginbtn.etcLeftBtnMargin}
                onPress={() => {
                  this.props.navigation.navigate('Signup');
                }}
              >
                <Text style={loginbtn.signupPasswordFont}>회원가입</Text>
              </Button>
            </Form>
            <Form style={loginbtn.MiddleLineMargin}>
              <Text> | </Text>
            </Form>
            <Form>
              <Button transparent onPress={() => {}}>
                <Text style={loginbtn.signupPasswordFont}>비밀번호 찾기</Text>
              </Button>
            </Form>
          </Form>
        </Form>
      </Container>
    );
  }
}