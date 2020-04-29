import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    ActivityIndicator,
    AsyncStorage,
    FlatList,
} from 'react-native';
import { connect } from 'react-redux'
import BackIcon from '../../components/BackIcon';
import BaomoiText from '../../components/StyledText.js';
import { Avatar, Card, Icon, Button, Divider, Badge } from 'react-native-elements';
import { customFont } from '../../constants/Fonts.js';

class TermsScreen extends React.PureComponent {
    static navigationOptions = ({navigation}) => {
        const { textColor, backgroundColor } = navigation.state.params.UI
        return {
            tabBarVisible: false,
            header: () => (
                    <SafeAreaView
                        style={{
                            height: 50,
                            flexDirection: "row",
                            backgroundColor: backgroundColor,
                            alignItems:'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#e0e0e0',

                        }}
                    >
                        <BackIcon style={{flex: 1, width: 50, height:50, alignItems: 'center', justifyContent: 'center'}}
                                  onPress={() => {
                                            navigation.goBack()
                                            navigation.openDrawer()
                                        }}
                        />
                        <View style={{flex: 4, alignItems: "center"}}><Text style={{fontSize: 20, fontWeight: "bold", color: textColor}}>Điều khoản</Text></View>
                        <View style={{flex: 1}}></View>
                    </SafeAreaView>
            )
        }
    }

    render(){
        const { textColor, backgroundColor } = this.props.UI
        const TextStyled = (props) => {
            return(
                <View>
                    {(props.bold !== true)?
                        <Text style={{color: textColor, margin: 5, textAlign: "justify", fontSize: 18, lineHeight: 26, fontFamily: customFont }}>{props.content}</Text>
                    :
                        <Text style={{color: textColor, margin: 5, textAlign: "justify", fontSize:20, lineHeight: 29, fontWeight: "bold", fontFamily: customFont}}>{props.content}</Text>
                    }
                </View>

            )
        }
        return(
            <ScrollView style={{backgroundColor: backgroundColor, flex: 1, }}>
                <View style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 10 }}>
                    <View style={{alignSelf: "center"}}>
                        <Text style={{fontWeight: "bold", fontSize: 22, color: textColor, fontFamily: customFont }}>ĐIỀU KHOẢN SỬ DỤNG</Text>
                    </View>
                    <View>
                        <TextStyled
                            content="Thỏa thuận sử dụng và bảo mật này (sau đây gọi là “Thỏa thuận”) được lập ra bởi và giữa bạn (“bạn”) và  BaomoiPress (“Baomoi” hoặc “chúng tôi”) về việc sử dụng bất kỳ hay tất cả các loại dịch vụ (“Dịch vụ”) của Baomoi.press (“Baomoi”) của bạn. Bằng việc sử dụng Dịch vụ, bạn đồng ý chịu ràng buộc bởi những điều khoản và điều kiện này."
                        />
                        <TextStyled
                            content="Dịch vụ được thiết kế để giúp bạn tiếp cận thông tin tin tức được liên kết từ các trang không do BaomoiPress sở hữu hoặc quản lý. Cụ thể, Dịch vụ cung cấp những mô tả ngắn gọn về các bài báo để giúp bạn xác định nội dung chính của bài báo mà bạn quan tâm. Khi bạn lựa chọn một bài báo, bạn sẽ được kết nối tới website chứa bài báo đó (sau đây gọi là “website được kết nối”)."
                        />
                        <TextStyled
                            content="Thuật ngữ “bạn” để chỉ tất cả các cá nhân và/hoặc các tổ chức truy cập vào Baomoi vì bất kỳ lý do nào."
                        />
                        <TextStyled
                            content="I. Thỏa thuận sử dụng"
                            bold={true}
                        />
                        <TextStyled
                            content="II.1. Những thông tin mà chúng tôi thu thập"
                            bold={true}
                        />
                        <TextStyled
                            content="Khi bạn đăng ký làm thành viên, bạn cần cung cấp cho chúng tôi một số thông tin cá nhân, ví dụ như họ tên, địa chỉ email và các thông tin khác do bạn cung cấp. Chúng tôi có thể kết hợp thông tin cá nhân do bạn cung cấp với các thông tin khác ngoài Dịch vụ hoặc từ các bên thứ ba để phân tích các nội dung mà bạn quan tâm."
                        />
                        <TextStyled
                            content="Mỗi khi bạn truy cập Dịch vụ, hệ thống của Baomoi sẽ sử dụng cookies và các kỹ thuật khác để lưu lại những hoạt động của bạn trên Baomoi. Server của Baomoi cũng sẽ tự động ghi lại thông tin khi bạn truy cập trang này và sử dụng các Dịch vụ bao gồm nhưng không giới hạn URL, địa chỉ IP, loại trình duyệt, ngôn ngữ, ngày giờ truy cập hoặc sử dụng Dịch vụ."
                        />
                        <TextStyled
                            content="II.2. Sử dụng thông tin"
                            bold={true}
                        />
                        <TextStyled
                            content="Chúng tôi sử dụng thông tin cá nhân của bạn để nâng cao chất lượng của Dịch vụ, để gửi tới bạn các thông báo về dịch vụ mới của Baomoi hoặc dịch vụ của bên thứ ba mà chúng tôi tin rằng sẽ hữu ích với bạn."
                        />
                        <TextStyled
                            content="Chúng tôi có thể sử dụng thông tin cá nhân của bạn trong việc điều tra, nghiên cứu hoặc phân tích để vận hành và nâng cấp các kỹ thuật của Baomoi và Dịch vụ."
                        />
                        <TextStyled
                            content="Chúng tôi có thể sử dụng thông tin cá nhân của bạn để xác định xem liệu bạn có thể quan tâm đến các sản phẩm hay dịch vụ của bên thứ ba nào không."
                        />
                        <TextStyled
                            content="Về nguyên tắc, chúng tôi không cung cấp cho bên thứ ba thông tin cá nhân của bạn trừ các trường hợp sau:"
                        />
                        <TextStyled
                            content="Bạn đồng ý để chúng tôi cung cấp thông tin cá nhân của bạn cho bên thứ ba; và/hoặc"
                        />
                        <TextStyled
                            content="Chúng tôi cho rằng việc cung cấp thông tin cá nhân của bạn cho bên thứ ba là cần thiết, ví dụ nhằm tuân theo các yêu cầu pháp lý, ngăn chặn tội phạm hoặc bảo vệ an ninh quốc gia, hay bảo vệ an toàn cá nhân của những người sử dụng hoặc công chúng, v.v…; và/hoặc"
                        />
                        <TextStyled
                            content="Bên thứ ba là đối tượng mua lại toàn bộ hay phần lớn pháp nhân sở hữu Baomoi và Dịch vụ; và/hoặc
Thông tin cá nhân là thông tin vô danh về khách ghé thăm Baomoi. Chúng tôi có thể chia sẻ loại thông tin này cho bên thứ ba để họ có thể tìm hiểu về các loại khách tới thăm Baomoi và cách họ sử dụng Dịch vụ.

"
                        />
                        <TextStyled
                            content="II.3. Sửa đổi hoặc xoá thông tin"
                            bold={true}
                        />
                        <TextStyled
                            content="Bạn có thể truy cập thông tin cá nhân của mình và sử đổi thông tin này nếu chúng chưa đúng hoặc xoá bỏ các thông tin đó. Việc thay đổi và/hoặc xoá bỏ như trên có thể không thực hiện được vào một số thời điểm nhất định khi có sự bất ổn định của hệ thống Baomoi. Trong trường hợp này, chúng tôi sẽ nỗ lực để bạn có thể tiếp tục sửa chữa hoặc xoá bỏ thông tin cá nhân sớm nhất có thể nhưng chúng tôi không chịu trách nhiệm về bất cứ vấn đề hoặc thiệt hại nào có thể có do việc chậm trễ này gây ra."
                        />
                        <TextStyled
                            content="II.4. Bảo mật"
                            bold={true}
                        />
                        <TextStyled
                            content="Mật khẩu truy cập tài khoản của tất cả các thành viên của Baomoi đều được BaomoiPress bảo vệ. Tuy nhiên, an ninh mạng không an toàn tuyệt đối, vì thế BaomoiPress không chịu trách nhiệm về những thiệt hại có thể xảy ra."
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(mapStateToProps)(TermsScreen)