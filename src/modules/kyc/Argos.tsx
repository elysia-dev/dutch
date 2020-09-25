import React, { FunctionComponent, useContext, useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import styled from 'styled-components/native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SubmitButton } from '../../shared/components/SubmitButton';
import i18n from '../../i18n/i18n';
import UserContext from '../../contexts/UserContext';
import LocaleType from '../../enums/LocaleType';
import WrapperLayout from '../../shared/components/WrapperLayout';
import { TitleText } from '../../shared/components/TitleText';
import { PText } from '../../shared/components/PText';

// const H1Text = styled.Text`
//   color: #1c1c1c;
//   font-weight: bold;
//   text-align: left;
//   font-size: 18px;
//   margin-top: 30px;
//   margin-bottom: 25px;
// `;
// const PText = styled.Text`
//   color: #5c5b5b;
//   margin-bottom: 10px;
//   font-size: 15px;
//   line-height: 30px;
//   text-align: left;
//   padding-bottom: 110px;
// `;
type ParamList = {
  Argos: {
    agree: boolean;
    updateAgree: (input: boolean) => void;
  };
};
// <View
//   style={{
//     backgroundColor: '#fff',
//     width: '100%',
//     paddingTop: 25,
//   }}>
//   <ScrollView
//     style={{
//       backgroundColor: '#fff',
//       width: '100%',
//       paddingLeft: 20,
//       paddingRight: 20,
//       paddingTop: 40,
//     }}>
//     <H1Text>{i18n.t('kyc_label.argos_terms')}</H1Text>
//     <PText>{localeTerms}</PText>
//   </ScrollView>
//   <View
//     style={{
//       backgroundColor: '#fff',
//       width: '100%',
//       height: 60,
//       position: 'absolute',
//       bottom: 0,
//     }}>
//     <SubmitButton
//       title={i18n.t('kyc_label.agree')}
//       handler={() => {
//         route.params.updateAgree(true);
//         navigation.goBack();
//       }}
//       style={{ position: 'absolute', bottom: 20 }}
//     />
//   </View>
// </View>
export const Argos: FunctionComponent<{}> = () => {
  const { locale } = useContext(UserContext);
  const navigation = useNavigation();
  const localeTerms = terms[locale === LocaleType.KO ? locale : LocaleType.EN];
  const route = useRoute<RouteProp<ParamList, 'Argos'>>();

  return (
    <WrapperLayout
      title={<TitleText label={i18n.t('kyc_label.argos_terms')} />}
      isScrolling={false}
      isBackbutton={false}
      body={
        <ScrollView
          style={{ marginLeft: '5%', marginRight: '5%', height: '70%' }}>
          <PText label={localeTerms} />
        </ScrollView>
      }
      button={
        <View style={{ paddingTop: 50, height: '20%' }}>
          <SubmitButton
            title={i18n.t('kyc_label.agree')}
            handler={() => {
              route.params.updateAgree(true);
              navigation.goBack();
            }}
            style={{ position: 'absolute', bottom: 20 }}
          />
        </View>
      }
    />
  );
};

const terms = {
  ko: `개인정보처리 및 쿠키 정책
  1. 개요
  아르고스 솔루션을 제공하는 주식회사 풀스택(이하 ‘회사’)는 귀하의 개인 정보를 보호하고 존중합니다. 우리는 모든 직원, 서비스 제공 및 제휴사가 이러한 의무를 준수하도록 보장하기 위해 동등하게 노력합니다. 또한 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 및 관계 법령의 개인정보보호규정 등을 준수합니다. 본 ‘개인정보처리방침’은 회사가 제공하는 모든 제품, 서비스, 콘텐츠, 기술 등에 적용됩니다. 개인데이터에 대한 처리에 대한 당사의 견해와 관행을 이해하기 위해 다음을 주의 깊게 읽으십시오.
  \n2. 수집하는 개인정보 항목
  회사는 회사의 서비스를 제공하기 위해 필요한 최소한의 개인정보를 수집합니다. 개인정보 수집 이용을 원하지 않는 경우에 이용자는 거부할 수 있으나, 서비스 이용에 일부 제한이 있을 수 있습니다.
  회사가 수집하는 개인정보는 하기와 같습니다.
  1) 회원 가입
  이메일, 비밀번호
  2) KYC / AML 서비스 제공
  회사는 KYC / AML 서비스에 대한 다음 정보를 수집합니다.
  성명, 생년월일 및 국적과 같은 신분에 관한 정보;
  이메일 주소, 전화 번호와 같은 연락처 정보;
  블록 체인 주소 및 공개 키와 같은 블록 체인 식별자.
  여권 사진, 정부 발급 신분증 및 주민등록증과 같은 신원 정보;
  서비스 제공 프로세스 중에 자동으로 생성되는 정보 : 연결 IP 정보, 서비스 사용 로그, 액세스 로그, 쿠키
  \n3. 개인정보의 수집 및 이용
  회사는 수집된 정보를 다음과 같은 목적으로 사용합니다.
  회사의 법적, 규제 및 계약 상 의무를 이행합니다. 신원 확인, 회원 탈퇴와 같은 회원 관리; 회사의 원활한 서비스 운영을 방해할 수 있는 행위를 방지하고 제재합니다. 시장 분석 및 조사, 인구 통계 학적 데이터 공유; 마케팅 목적을 위한 개인 데이터 처리 : 귀하는 이 목적을 수행하기 전에 귀하의 동의를 요청하는 통지를 받게 됩니다. 사고 및 사고 조사에 대한 법적 의무에 따라 법적 조사 데이터를 제공합니다.
  \n4. 개인정보의 보유 및 이용기간
  대부분 당사는 귀하의 개인 데이터를 최대 5 년간 보관합니다. 경우에 따라 법의 요구에 따라 귀하의 개인 데이터 중 일부를 장기간 보관해야 할 수도 있습니다. 우리의 재량에 따라, 우리는 법적 의무를 이행하기 위해 합리적으로 필요하다고 판단되는 기간 동안 개인 정보를 보유할 수 있습니다. 또한 개별적으로 이용자의 동의를 받을 경우에는 계약된 기간에 따라 개인정보를 보유합니다.
  1) 로그인 기록
  관련 법령 : 통신비밀보호법. 보존 기간 : 3개월
  2) 서비스공급에 관한 기록
  관련 법령 : 전자상거래 등에서의 소비자보호에 관한 법률. 보존 기간 : 5년
  \n5. 개인정보의 저장
  회사는 개인정보의 암호화 및 보호를 위해 해외 클라우드 서비스를 이용합니다. 이와 관련하여 개인정보의 저장에 관해 다음과 같이 공지합니다.
  Amazon Web Service 사용에 따른 개인정보의 클라우드 서버 저장
  1) 저장 항목. 회원 가입 및 KYC/AML 서비스 제공 시 수집된 정보
  2) 이전 국가 및 일시. 국가 : Amazon Web Service 서비스 제공 지역. 일시 : 각 회원가입 시기, 정보 입력 및 변경 시점
  3) 클라우드 서비스 제공자. 업체명 : Amazon Web Services, Inc. 주소 : 1200 12th Avenue South, Suite 1200, Seattle, WA 98144, United States. 전화 : +1-206-266-4064
  \n6. 개인정보의 파기 방법
  이용자의 개인정보는 내부 방침에 따른 이용 목적 달성 및 기타 관련 법령에 의한 정보보유 사유에 따라 일정기간이 지난 후 파기됩니다. 파기 방법은 하기와 같습니다.
  전자적 파일 형태인 경우: 복원이 불가능한 방법으로 영구 삭제; 상기 전자적 파일 외의 기록물, 인쇄물, 서면, 그 밖의 기록매체인 경우 : 파쇄 또는 소각;
  \n7. 개인정보 보호 책임자
  회사는 개인정보 보호에 대한 업무 총괄, 개인정보 처리와 관련된 정보주체의 응대 및 피해구제를 위하여 하기와 같이 개인정보보호 책임자를 지정합니다.
  개인정보 보호 업무 연락처 Email : kyc.support@argos-solutions.io. 개인정보 보호 책임자 : 손성호 이사
  \n8. 정보주체의 권리와 그 행사 방법
  1) GDPR에 근거하여 정보주체는 회사에 대해 언제든지 다음 각호의 개인정보보호 관련 권리를 행사할 수 있습니다.
  개인정보 열람요구
  개인정보 정정요구
  개인정보 삭제요구
  개인정보 처리정지 요구
  2) 1항에 따른 권리 행사는 개인정보 보호 업무 연락처 및 책임자에게 서면, 전자우편 등을 통하여 하실 수 있으며 회사는 처리요청에 대해 지체 없이 조치합니다.
  3) 정보주체가 정정 또는 삭제를 요구한 경우에 회사는 해당 요청을 완료할 때까지 개인정보를 이용하거나 제공하지 않습니다.
  4) 정보주체는 언제든지 등록되어 있는 자신의 개인정보를 조회, 수정 및 삭제 요청을 할 수 있습니다.
  \n9. 아르고스의 쿠키 정책
  해당 사항은 argos-solutions.io 에서 액세스 할 수 있는 argos-solutions의 쿠키 정책입니다.
  쿠키 란 무엇인가?
  대부분의 웹 사이트에서 흔히 볼 수 있는 것처럼 이 사이트에서는 컴퓨터에 다운로드 되는 작은 파일 인 쿠키를 사용하여 경험을 향상시킵니다. 이 페이지는 그들이 수집 한 정보, 사용 방법 및 때때로 이러한 쿠키를 저장해야 하는 이유를 설명합니다. 또한 이러한 쿠키가 저장되는 것을 막을 수 있는 방법을 공유하지만 사이트 기능의 특정 요소를 다운 또는 '중단'시킬 수 있습니다. 쿠키에 대한보다 일반적인 정보는 Wikipedia의 HTTP 쿠키에 대한 기사를 참조하십시오.
  우리가 쿠키를 사용하는 방법
  우리는 아래에서 자세히 설명하는 다양한 이유로 쿠키를 사용합니다. 불행히도 대부분의 경우 이 사이트에 추가되는 기능 및 기능을 완전히 비활성화하지 않고 쿠키를 사용하지 않도록 설정하는 산업 표준 옵션이 없습니다. 사용하는 서비스를 제공하는 데 사용되는 경우에 필요하지 않은 지 여부를 모르는 경우 모든 쿠키를 그대로 두는 것이 좋습니다.
  쿠키 비활성화
  브라우저의 설정을 조정하여 쿠키 설정을 막을 수 있습니다 (브라우저 도움말 참조). 쿠키를 사용 중지하면이 웹 사이트 및 귀하가 방문하는 다른 많은 웹 사이트의 기능에 영향을 미칩니다. 쿠키를 사용하지 않으면 일반적으로 이 사이트의 특정 기능 및 기능이 비활성화됩니다. 따라서 쿠키를 비활성화하지 않는 것이 좋습니다.
  우리가 설정한 쿠키
  1. 양식 관련 쿠키
  연락처 페이지 나 의견 양식에 있는 양식을 통해 데이터를 제출할 때 쿠키는 향후 통신을 위해 사용자 세부 정보를 기억하도록 설정될 수 있습니다.
  2. 제 3 자 쿠키
  특별한 경우에는 신뢰할 수 있는 제 3자가 제공하는 쿠키도 사용합니다. 다음 섹션에서는 이 사이트를 통해 발생할 수 있는 제 3 자 쿠키에 대해 자세히 설명합니다.
  이 사이트는 귀하가 사이트 사용 방법과 귀하의 경험을 향상시킬 수 있는 방법을 이해하도록 돕기 위해 웹상에서 가장 광범위하고 신뢰할 수 있는 분석 솔루션 중 하나 인 Google Analytics를 사용합니다. 이러한 쿠키는 사이트에 머문 시간과 방문한 페이지를 추적하여 매력적인 콘텐츠를 계속 제작할 수 있습니다.
  Google Analytics 쿠키에 대한 자세한 내용은 공식 Google Analytics 페이지를 참조하십시오.
  제 3 자 분석은 이 사이트의 사용을 추적하고 측정하여 매력적인 콘텐츠를 계속 제작할 수 있도록 합니다. 이러한 쿠키는 귀하가 사이트 또는 페이지 방문에 소비하는 시간을 추적할 수 있습니다. 이는 귀하가 사이트를 개선할 수 있는 방법을 이해하는 데 도움이 됩니다.
  더 많은 정보를 찾고 계신다면 선호하는 연락 방법 중 하나인 이메일 : support@argos-solutions.io를 통해 문의하실 수 있습니다.
  \n10. 추가정보
  개인정보의 침해에 대한 신고나 상담이 필요하신 경우 아래 기관으로 문의하시기 바랍니다.
  개인정보 침해신고 센터 : (국번없이)118 (http://privacy.kisa.or.kr)
  개인정보분쟁조정위원회 : 1833-6972 (http://www.kopico.go.kr)
  대검찰청 사이버수사과 : (국번없이)1301 (http://www.spo.go.kr)
  경찰청 사이버안전국 : (국번없이)182 (http://cyber.go.kr)
  \n11. 회사 정보
  대표자 : 이원규
  사업자 등록 번호 : 303-86-00956
  회사명 : ㈜풀스택`,
  en: `Privacy and Cookie Policy
  1. Summary
  Full Stack Inc. ("Company"), which provides Argos Solutions, protects and respects your personal information. We render our best effort to ensure that all employees, service providers and affiliates comply with the Personal Information Protection Act. This "Privacy Policy" applies to all products, services, contents, technology, etc. provided by the Company. Please read the following carefully to understand our views and practices regarding the processing of personal data.
  \n2. Personal Information Collected
  The Company collects only the minimum amount of personal information necessary to provide the Company's services. If you do not wish to have the Company to collect certain personal information, you may refuse to provide such information, but there may be some limitations to the use of the Company’s services.
  Personal information collected by the Company are as follows
  1) Account Registration
  Email address, password
  2) KYC / AML Service
  The Company collects the following information for KYC/AML service.
  Information on identity, such as name, date of birth and nationality;
  Contact information such as email address, phone number;
  Blockchain identifiers such as blockchain addresses and public keys;
  Identification information, such as passport photos, government-issued identification, and a national identification card;
  Information automatically generated during the service provision process: connection IP information, service utilization log, access log, cookies;
  \n3. Collection and Use of Personal Information
  The Company uses the collected information about you for the following purposes:
  Fulfilling the Company's legal, regulatory and contractual obligations; Member management such as identity verification, membership withdrawal; Preventing and sanctioning acts that may disrupt the Company's smooth operation of services; Conducting market analysis and research, sharing demographic data; Processing Personal Data for Marketing Purposes: You will receive a notice requesting you consent prior to the performance of this purpose. Providing legal investigation data in accordance with legal obligations for investigation of incidents and accidents;
  \n4. Retention and Use Period of Personal Information
  Unless agreed otherwise, the Company keeps your personal data for up to 5 years. In some cases, you may be required to retain some of your personal data for a certain period of time in accordance with the relevant law and regulations. At our discretion, we may retain personal information for a period of time reasonably necessary to fulfill our legal obligations. In addition, if you individually agree with you, we will keep your personal information for the contracted period of time.
  1) Login History Related Laws: Telecommunications Privacy Act Retention period: 3 months
  2) Records on Service Provision Related Laws: Act on Consumer Protection in Electronic Commerce, Etc. Retention period: 5 years
  \n5. Storing Personal Information
  The Company uses Amazon Web Services cloud computing services to encrypt and protect personal information.
  1) Stored Information Information collected when accounting and providing KYC / AML service
  2) Time and location of data storage Country : Countries where Amazon Web Services are provided Time : At signup and inputing/editing personal information
  3) Cloud Service Provider Company : Amazon Web Services, Inc. Address : 1200 12th Avenue South, Suite 1200, Seattle, WA 98144, United States Tel : +1-206-266-4064
  \n6. Destruction of Personal Information
  The personal information of the users shall be destroyed after a certain period of time, depending on the purpose of using the service according to the internal policy and the reasons for the information retention under the related statutes. The method and manner of destruction are as follows.
  In electronic file format: permanently deleted in an unrecoverable manner; For records other than electronic files above, printed, written or otherwise recorded media: shredded or incinerated;
  \n7. Personal Information Protection Officer
  The Company designates the person in charge of personal information protection as follows for the purpose of the Company's handling and handling of personal information.
  Contact Information Email : kyc.support@argos-solutions.io Protection Officer : Sungho Son (Argos Director)
  \n8. Rights of Information Authorities and How to Exercise Them
  1) In accordance with the GDPR, you may exercise the following rights regarding your personal information protection against the Company at any time:
  Requesting access to your personal information access demand
  Requesting correction to your personal information correction request
  Requesting deletion of your personal information deletion request
  Requesting suspension to your personal information processing
  2) The rights under Section 7-1 can be exercised by emailing the person in charge and/or the email address under Personal Information Protection Officer, and the Company shall take action against the request without delay.
  3) If the information subject requests correction or deletion, the Company will not use or provide the personal information of the subject until the request is completed.
  4) The information subject can request to view, modify, and delete his or her personal information accounted at any time.
  \n9. Cookie Policy for argos-solutions
  This is the Cookie Policy for argos-solutions, accessible from https://www.argos-solutions.io/
  What Are Cookies
  As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or 'break' certain elements of the sites functionality. For more general information on cookies see the Wikipedia article on HTTP Cookies.
  How We Use Cookies
  We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
  Disabling Cookies
  You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of the this site. Therefore it is recommended that you do not disable cookies.
  The Cookies We Set
  1. Forms related cookies
  When you submit data to through a form such as those found on contact pages or comment forms cookies may be set to remember your user details for future correspondence.
  2. Third Party Cookies
  In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.
  This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.
  For more information on Google Analytics cookies, see the official Google Analytics page.
  Third party analytics are used to track and measure usage of this site so that we can continue to produce engaging content. These cookies may track things such as how long you spend on the site or pages you visit which helps us to understand how we can improve the site for you.
  However if you are still looking for more information then you can contact us through one of our preferred contact methods: ​Email: support@argos-solutions.io
  \n10. More
  If you need to report or discuss any infringement of your personal information, please contact:
  Privacy Reporting Center : (http://privacy.kisa.or.kr)
  Personal Information Dispute Adjustment Committee: 1833-6972 (http://www.kopico.go.kr)
  Supreme Public Prosecutors' Office Cyber Crime Department :(http://www.spo.go.kr)
  National Police Agency Cybersecurity Agency : (http://cyber.go.kr)
  \n11. Company Information
  Wonkyu Lee
  Business License No.: 303-86-00956
  FullStack Inc.
  E-mail: info@argos-solutions.io
  Address: 13F, 343 Samil-daero, Jung-gu, Seoul, Korea 04538
  ⓒ 2018 FullStack Inc. All rights reserved.
  `,
};
