// tslint:disable-next-line: import-name
import AsyncStorage from '@react-native-community/async-storage';
import { Button, Container, Form } from 'native-base';
import * as React from 'react';
import { Platform, ScrollView, Text } from 'react-native';
import { BASE_URL, CLIENT_ID } from '../../../config/client';
import { mypageRootStyles } from '../style';
import { MiniProfile } from './mini-profile';
import { PghdRecord } from './pghd-record';

const styles = mypageRootStyles;
const todayButtonName = '오늘 기록하기';
// const pghdRecordZero = '기록 된 내용이 없습니다.';

interface Props {
  navigation: any;
  navi: any;
  date: string;
  email: string;
  id: string;
  userWallet: string;
}
interface State {
  usersPghdData: any;
  personalInfo: any;
  update: boolean;
  postUserWallet: number;
}

const dateFunc = (dateStr: string) => {
  return dateStr.slice(0, 10);
};

export class MypageRoot extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      usersPghdData: null,
      personalInfo: [],
      update: false,
      postUserWallet: 0,
    };
  }

  componentDidMount = async () => {
    try {
      const signData = this.props.navigation.state.params.signData;
      const userEmail = this.props.email;
      const userId = this.props.id;
      const GET_USER_DATA = `api/v1/users/${userEmail}`;
      const POST_GET_USER_WALLET = `api/v1/users/${userId}/userWallet`;
      await AsyncStorage.setItem('accessToken', signData.accessToken);
      await AsyncStorage.setItem('userEmail', userEmail);

      // [POST]userWallet
      if (this.props.userWallet !== '') {
        this.postUserWalletRequestFunc(
          signData.accessToken,
          POST_GET_USER_WALLET,
        );
      }

      // [GET]userWallet
      const getUserWallet = await this.getRequestFunc(
        signData.accessToken,
        POST_GET_USER_WALLET,
      );
      await AsyncStorage.setItem(
        'walletAddress',
        getUserWallet.data[0].address,
      );

      // [GET]PGHD(Get user pghd)
      const walletAddress = await AsyncStorage.getItem('walletAddress');
      const GET_USER_PGHD = `api/v1/clients/${CLIENT_ID}/users/${walletAddress}/pghd`;
      const getUserPghd = await this.getRequestFunc(
        signData.accessToken,
        GET_USER_PGHD,
      );
      if (getUserPghd.data !== null) {
        this.setState({ usersPghdData: getUserPghd.data });
      }

      // [GET]Users
      const getUserInfo = await this.getRequestFunc(
        signData.accessToken,
        GET_USER_DATA,
      );
      let relationStr = '';
      if (getUserInfo.relationship === null) {
        relationStr += '관계미정';
      } else {
        relationStr += getUserInfo.relationship;
      }
      this.setState({
        personalInfo: [getUserInfo.nickname, relationStr],
      });
    } catch (error) {
      alert(`error: ${error}`);
    }
  }

  componentDidUpdate = async () => {
    // tslint:disable-next-line: no-boolean-literal-compare
    if (this.state.update === true) {
      const walletAddress = await AsyncStorage.getItem('walletAddress');
      const accessToken = await AsyncStorage.getItem('accessToken');
      const GET_USER_PGHD = `api/v1/clients/${CLIENT_ID}/users/${walletAddress}/pghd`;
      const getUserPghd = await this.getRequestFunc(accessToken, GET_USER_PGHD);
      this.setState({ usersPghdData: getUserPghd.data, update: false });
    }
  }

  // [GET]
  getRequestFunc = (token: string | null, path: string) => {
    if (token !== null) {
      return fetch(BASE_URL + path, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
        .then(res => {
          if (res.status !== 200) {
            alert(`error: ${'요청에 응답 할 수 없습니다.'}`);
          } else if (res.status === 200) {
            return res.json();
          }
        })
        .catch(error => {
          alert(`error: ${error}`);
        });
    }
  }

  // [POST] userWallet
  postUserWalletRequestFunc = (token: string | null, path: string) => {
    if (token !== null) {
      return fetch(BASE_URL + path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          userId: this.props.id,
          address: this.props.userWallet,
          type: 'ethureum',
          priority: 0,
        }),
      })
        .then(res => {
          if (res.status !== 200) {
            alert(`error: ${'요청에 응답 할 수 없습니다.'}`);
          } else if (res.status === 200) {
            return res.json();
          }
        })
        .catch(error => {
          alert(`error: ${error}`);
        });
    }
  }

  renderBooleanFunc = () => {
    this.setState({
      update: true,
    });
  }

  render() {
    console.log(this.state.update);
    return (
      <Container style={styles.container}>
        <ScrollView>
          <MiniProfile navi={this.props} children={this.state.personalInfo} />
          <Form
            style={[styles.shadow, { alignItems: 'center', marginBottom: 20 }]}
          >
            <Button
              style={
                Platform.OS === 'ios'
                  ? styles.mainButton
                  : [styles.mainButton, styles.shadow]
              }
              onPress={() => {
                this.props.navigation.navigate('TodayPghd', {
                  beforePghd: undefined,
                  updateFunc: this.renderBooleanFunc,
                });
              }}
            >
              <Text style={styles.todayRecord}>{todayButtonName}</Text>
            </Button>
          </Form>

          <Form style={[styles.shadow, { width: '90%', alignSelf: 'center' }]}>
            {this.state.usersPghdData === null ? (
              <Text>{/*pghdRecordZero*/}</Text>
            ) : (
              this.state.usersPghdData.reverse().map((pghdData: any) => {
                const date = dateFunc(pghdData.updatedAt);
                const pghd = JSON.parse(pghdData.data).pghd;
                const pghdId = pghdData.id;
                return (
                  <PghdRecord
                    navi={this.props}
                    key={pghdData.id}
                    children={[
                      this.state.personalInfo[0],
                      date,
                      pghd,
                      pghdId,
                      this.renderBooleanFunc,
                    ]}
                  />
                );
              })
            )}
          </Form>
        </ScrollView>
      </Container>
    );
  }
}