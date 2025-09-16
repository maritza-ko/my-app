// FIX: The original file content was invalid and has been replaced with a functional React component.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, GenerateContentResponse, Type as GoogleGenAIType } from "@google/genai";

// --- MOCK DATA & HELPERS ---

const LOCATION_NAME_STORAGE_KEY = 'delivery-assistant-location-name';
const API_KEY_STORAGE_KEY = 'delivery-assistant-api-key';

const KOREAN_ADMIN_DIVISIONS: { [key: string]: { [key: string]: string[] } } = {
    '서울특별시': {
        '강남구': ['역삼동', '개포동', '청담동', '삼성동', '대치동', '신사동', '논현동', '압구정동', '세곡동', '일원동', '수서동', '도곡동'],
        '강동구': ['강일동', '고덕동', '길동', '둔촌동', '명일동', '상일동', '성내동', '암사동', '천호동'],
        '강북구': ['미아동', '번동', '수유동', '우이동'],
        '강서구': ['가양동', '개화동', '공항동', '과해동', '내발산동', '등촌동', '마곡동', '방화동', '염창동', '오곡동', '오쇠동', '외발산동', '화곡동'],
        '관악구': ['봉천동', '신림동', '남현동'],
        '광진구': ['광장동', '구의동', '군자동', '능동', '자양동', '중곡동', '화양동'],
        '구로구': ['신도림동', '구로동', '고척동', '개봉동', '오류동', '가리봉동', '항동'],
        '금천구': ['가산동', '독산동', '시흥동'],
        '노원구': ['월계동', '공릉동', '하계동', '상계동', '중계동'],
        '도봉구': ['쌍문동', '방학동', '창동', '도봉동'],
        '동대문구': ['신설동', '용두동', '제기동', '전농동', '답십리동', '장안동', '청량리동', '회기동', '휘경동', '이문동'],
        '동작구': ['노량진동', '상도동', '본동', '흑석동', '동작동', '사당동', '대방동', '신대방동'],
        '마포구': ['공덕동', '아현동', '도화동', '용강동', '대흥동', '염리동', '신수동', '서교동', '합정동', '망원동', '연남동', '성산동', '상암동'],
        '서대문구': ['충정로동', '천연동', '북아현동', '신촌동', '연희동', '홍제동', '홍은동', '남가좌동', '북가좌동'],
        '서초구': ['서초동', '잠원동', '반포동', '방배동', '양재동', '내곡동'],
        '성동구': ['왕십리도선동', '마장동', '사근동', '행당동', '응봉동', '금호동', '옥수동', '성수동', '송정동', '용답동'],
        '성북구': ['성북동', '삼선동', '동선동', '돈암동', '안암동', '보문동', '정릉동', '길음동', '종암동', '월곡동', '장위동', '석관동'],
        '송파구': ['풍납동', '거여동', '마천동', '방이동', '오금동', '송파동', '석촌동', '삼전동', '가락동', '문정동', '장지동', '잠실동'],
        '양천구': ['신정동', '목동', '신월동'],
        '영등포구': ['영등포동', '여의동', '당산동', '도림동', '문래동', '양평동', '신길동', '대림동'],
        '용산구': ['후암동', '용산2가동', '남영동', '청파동', '원효로동', '효창동', '용문동', '한강로동', '이촌동', '이태원동', '한남동', '서빙고동', '보광동'],
        '은평구': ['녹번동', '불광동', '갈현동', '구산동', '대조동', '응암동', '역촌동', '신사동', '증산동', '수색동', '진관동'],
        '종로구': ['청운효자동', '사직동', '삼청동', '부암동', '평창동', '무악동', '교남동', '가회동', '종로1·2·3·4가동', '종로5·6가동', '이화동', '혜화동', '창신동', '숭인동'],
        '중구': ['소공동', '회현동', '명동', '필동', '장충동', '광희동', '을지로동', '신당동', '다산동', '약수동', '청구동', '동화동', '황학동', '중림동'],
        '중랑구': ['면목동', '상봉동', '중화동', '묵동', '망우동', '신내동']
    },
    '부산광역시': {
        '강서구': ['대저동', '강동동', '명지동', '죽림동', '식만동', '죽동동', '봉림동', '송정동', '화전동', '녹산동', '생곡동', '구랑동', '지사동', '미음동', '범방동', '신호동', '동선동', '성북동', '눌차동', '천성동', '대항동'],
        '금정구': ['두구동', '노포동', '청룡동', '남산동', '서동', '금사동', '오륜동', '구서동', '장전동', '부곡동', '선동', '금성동'],
        '기장군': ['기장읍', '장안읍', '정관읍', '일광읍', '철마면'],
        '남구': ['대연동', '용호동', '용당동', '문현동', '우암동', '감만동'],
        '동구': ['초량동', '수정동', '좌천동', '범일동'],
        '동래구': ['명륜동', '온천동', '사직동', '수안동', '복산동', '명장동', '안락동', '칠산동', '낙민동'],
        '부산진구': ['양정동', '전포동', '부전동', '범천동', '범전동', '연지동', '초읍동', '부암동', '당감동', '가야동', '개금동'],
        '북구': ['금곡동', '화명동', '만덕동', '덕천동', '구포동'],
        '사상구': ['삼락동', '모라동', '덕포동', '괘법동', '감전동', '주례동', '학장동', '엄궁동'],
        '사하구': ['괴정동', '당리동', '하단동', '신평동', '장림동', '다대동', '구평동', '감천동'],
        '서구': ['동대신동', '서대신동', '부민동', '아미동', '초장동', '충무동', '남부민동', '암남동'],
        '수영구': ['남천동', '수영동', '망미동', '광안동', '민락동'],
        '연제구': ['거제동', '연산동'],
        '영도구': ['남항동', '영선동', '신선동', '봉래동', '청학동', '동삼동'],
        '중구': ['중앙동', '동광동', '대청동', '보수동', '부평동', '광복동', '남포동', '영주동'],
        '해운대구': ['우동', '중동', '좌동', '송정동', '반여동', '반송동', '재송동']
    },
    '대구광역시': {
        '남구': ['이천동', '봉덕동', '대명동'],
        '달서구': ['성당동', '두류동', '파산동', '감삼동', '죽전동', '장기동', '용산동', '이곡동', '신당동', '본리동', '상인동', '도원동', '진천동', '유천동', '대곡동', '월성동', '월암동', '송현동', '대천동', '호산동', '파호동', '갈산동', '호림동'],
        '동구': ['신암동', '신천동', '효목동', '도평동', '불로동', '지저동', '동촌동', '방촌동', '해안동', '안심동', '공산동'],
        '북구': ['고성동', '칠성동', '침산동', '산격동', '복현동', '대현동', '검단동', '노원동', '무태조야동', '관문동', '태전동', '구암동', '관음동', '읍내동', '동천동', '국우동'],
        '서구': ['내당동', '비산동', '평리동', '상중이동', '원대동'],
        '수성구': ['범어동', '만촌동', '황금동', '중동', '상동', '파동', '두산동', '지산동', '범물동', '고산동'],
        '중구': ['동인동', '삼덕동', '성내동', '대신동', '남산동', '대봉동'],
        '달성군': ['화원읍', '논공읍', '다사읍', '옥포읍', '현풍읍', '가창면', '하빈면', '구지면', '유가읍'],
        '군위군': ['군위읍', '소보면', '효령면', '부계면', '우보면', '의흥면', '산성면', '삼국유사면']
    },
    '인천광역시': {
        '강화군': ['강화읍', '선원면', '불은면', '길상면', '화도면', '양도면', '내가면', '하점면', '양사면', '송해면', '교동면', '삼산면', '서도면'],
        '계양구': ['효성동', '계산동', '작전동', '서운동', '계양동'],
        '남동구': ['구월동', '간석동', '만수동', '장수서창동', '남촌도림동', '논현동', '논현고잔동'],
        '동구': ['만석동', '화수동', '화평동', '송현동', '송림동', '금창동'],
        '미추홀구': ['숭의동', '용현동', '주안동', '도화동', '관교동', '문학동', '학익동'],
        '부평구': ['부평동', '산곡동', '청천동', '갈산동', '삼산동', '부개동', '일신동', '십정동'],
        '서구': ['검암경서동', '연희동', '청라동', '가정동', '석남동', '신현원창동', '가좌동', '검단동', '오류왕길동', '불로대곡동', '원당동', '당하동', '마전동'],
        '연수구': ['옥련동', '선학동', '연수동', '청학동', '동춘동', '송도동'],
        '옹진군': ['북도면', '연평면', '백령면', '대청면', '덕적면', '자월면', '영흥면'],
        '중구': ['신포동', '연안동', '신흥동', '도원동', '율목동', '동인천동', '개항동', '영종동', '운서동', '용유동']
    },
    '광주광역시': {
        '광산구': ['송정동', '도산동', '신흥동', '어룡동', '우산동', '월곡동', '비아동', '첨단동', '신가동', '운남동', '수완동', '하남동', '임곡동', '동곡동', '평동', '삼도동', '본량동'],
        '남구': ['월산동', '백운동', '주월동', '효덕동', '송암동', '대촌동', '봉선동', '사직동', '양림동', '방림동'],
        '동구': ['충장동', '동명동', '계림동', '산수동', '지산동', '서남동', '학동', '학운동', '지원동'],
        '북구': ['중흥동', '중앙동', '임동', '신안동', '용봉동', '운암동', '동림동', '우산동', '풍향동', '문화동', '문흥동', '두암동', '삼각동', '일곡동', '매곡동', '오치동', '석곡동', '건국동', '양산동'],
        '서구': ['양동', '양3동', '농성동', '광천동', '유덕동', '치평동', '상무동', '화정동', '서창동', '금호동', '풍암동', '동천동']
    },
    '대전광역시': {
        '대덕구': ['오정동', '대화동', '회덕동', '비래동', '송촌동', '중리동', '법동', '신탄진동', '석봉동', '덕암동', '목상동'],
        '동구': ['중앙동', '효동', '신인동', '판암동', '용운동', '대동', '자양동', '가양동', '용전동', '성남동', '홍도동', '삼성동', '대청동', '산내동'],
        '서구': ['복수동', '도마동', '정림동', '변동', '용문동', '탄방동', '둔산동', '갈마동', '월평동', '만년동', '가수원동', '관저동', '기성동'],
        '유성구': ['진잠동', '원신흥동', '상대동', '온천동', '노은동', '신성동', '전민동', '구즉동', '관평동'],
        '중구': ['은행선화동', '목동', '중촌동', '대흥동', '문창동', '석교동', '대사동', '부사동', '용두동', '오류동', '태평동', '유천동', '문화동', '산성동']
    },
    '울산광역시': {
        '남구': ['신정동', '달동', '삼산동', '삼호동', '무거동', '옥동', '야음장생포동', '대현동', '수암동', '선암동'],
        '동구': ['방어동', '일산동', '화정동', '대송동', '전하동', '남목동'],
        '북구': ['농소동', '강동동', '효문동', '송정동', '양정동', '염포동'],
        '중구': ['학성동', '반구동', '복산동', '성안동', '중앙동', '우정동', '태화동', '다운동', '병영동', '약사동'],
        '울주군': ['온산읍', '언양읍', '온양읍', '범서읍', '서생면', '청량면', '웅촌면', '두동면', '두서면', '상북면', '삼남면', '삼동면']
    },
    '세종특별자치시': {
        '세종시': ['한솔동', '새롬동', '도담동', '아름동', '종촌동', '고운동', '보람동', '대평동', '소담동', '다정동', '조치원읍', '연기면', '연동면', '부강면', '금남면', '장군면', '연서면', '전의면', '전동면', '소정면']
    },
    '경기도': {
        '수원시': ['파장동', '정자동', '이목동', '율전동', '천천동', '영화동', '송죽동', '조원동', '연무동', '상광교동', '하광교동', '세류동', '평동', '고색동', '오목천동', '평리동', '서둔동', '구운동', '탑동', '호매실동', '곡반정동', '권선동', '장지동', '대황교동', '입북동', '당수동', '팔달로', '남수동', '매향동', '북수동', '신풍동', '장안동', '교동', '매교동', '매산로', '고등동', '화서동', '지동', '우만동', '인계동', '영동', '중동', '구천동', '남창동', '영통동', '신동', '원천동', '하동', '매탄동', '망포동', '이의동'],
        '성남시': ['신흥동', '태평동', '수진동', '단대동', '산성동', '양지동', '복정동', '창곡동', '신촌동', '오야동', '심곡동', '고등동', '상적동', '둔전동', '시흥동', '금토동', '사송동', '성남동', '금광동', '은행동', '상대원동', '하대원동', '도촌동', '갈현동', '중앙동', '분당동', '수내동', '정자동', '율동', '서현동', '이매동', '야탑동', '판교동', '삼평동', '백현동', '금곡동', '궁내동', '동원동', '구미동', '운중동', '대장동', '석운동', '하산운동'],
        '의정부시': ['의정부동', '호원동', '장암동', '신곡동', '송산동', '자금동', '가능동', '흥선동'],
        '안양시': ['안양동', '석수동', '박달동', '비산동', '관양동', '평촌동', '호계동'],
        '부천시': ['원미동', '심곡동', '춘의동', '도당동', '약대동', '소사동', '역곡동', '중동', '상동', '오정동', '원종동', '고강동', '신흥동'],
        '광명시': ['광명동', '철산동', '하안동', '소하동', '일직동', '학온동'],
        '평택시': ['평택동', '통복동', '군문동', '원평동', '비전동', '동삭동', '세교동', '지제동', '송탄동', '서정동', '이충동', '지산동', '독곡동', '신장동', '팽성읍', '안중읍', '포승읍', '청북읍', '진위면', '서탄면', '고덕면', '오성면', '현덕면'],
        '동두천시': ['생연동', '중앙동', '보산동', '불현동', '송내동', '소요동', '상패동'],
        '안산시': ['일동', '이동', '사동', '본오동', '팔곡동', '양상동', '부곡동', '성포동', '월피동', '고잔동', '와동', '선부동', '초지동', '원곡동', '신길동', '백운동', '원시동', '목내동', '성곡동', '대부동'],
        '고양시': ['주교동', '원당동', '신도동', '흥도동', '성사동', '효자동', '창릉동', '화정동', '행주동', '능곡동', '화전동', '대덕동', '식사동', '중산동', '정발산동', '풍산동', '백석동', '마두동', '장항동', '고봉동', '일산동', '주엽동', '탄현동', '송포동', '송산동', '덕이동', '가좌동'],
        '과천시': ['중앙동', '갈현동', '원문동', '별양동', '부림동', '과천동', '문원동', '주암동', '막계동'],
        '구리시': ['갈매동', '사노동', '인창동', '교문동', '수택동', '아천동', '토평동'],
        '남양주시': ['와부읍', '진접읍', '화도읍', '진건읍', '오남읍', '퇴계원읍', '별내면', '수동면', '조안면', '평내동', '호평동', '금곡동', '양정동', '다산동', '별내동'],
        '오산시': ['중앙동', '남촌동', '신장동', '세마동', '초평동', '대원동'],
        '시흥시': ['대야동', '신천동', '신현동', '은행동', '매화동', '목감동', '군자동', '월곶동', '정왕동', '배곧동', '과림동', '연성동', '장곡동', '능곡동'],
        '군포시': ['산본동', '금정동', '당동', '당정동', '부곡동', '대야미동', '도마교동', '속달동', '둔대동'],
        '의왕시': ['오전동', '고천동', '부곡동', '내손동', '청계동'],
        '하남시': ['천현동', '신장동', '덕풍동', '감북동', '감일동', '위례동', '춘궁동', '초이동', '미사동', '풍산동'],
        '용인시': ['중앙동', '역삼동', '유림동', '동부동', '포곡읍', '모현읍', '백암면', '양지면', '원삼면', '신갈동', '영덕동', '구갈동', '상갈동', '기흥동', '서농동', '구성동', '마북동', '동백동', '상하동', '보정동', '풍덕천동', '신봉동', '죽전동', '동천동', '상현동', '성복동'],
        '파주시': ['문산읍', '조리읍', '법원읍', '파주읍', '월롱면', '탄현면', '광탄면', '파평면', '적성면', '장단면', '진동면', '진서면', '금촌동', '운정동', '교하동'],
        '이천시': ['장호원읍', '부발읍', '신둔면', '백사면', '호법면', '마장면', '대월면', '모가면', '설성면', '율면', '창전동', '중리동', '관고동', '증포동'],
        '안성시': ['공도읍', '보개면', '금광면', '서운면', '미양면', '대덕면', '양성면', '원곡면', '일죽면', '죽산면', '삼죽면', '고삼면', '안성동'],
        '김포시': ['김포본동', '장기본동', '사우동', '풍무동', '고촌읍', '양촌읍', '통진읍', '대곶면', '월곶면', '하성면', '구래동', '마산동', '운양동', '장기동'],
        '화성시': ['봉담읍', '우정읍', '향남읍', '남양읍', '매송면', '비봉면', '마도면', '송산면', '서신면', '팔탄면', '장안면', '양감면', '정남면', '새솔동', '동탄동', '병점동', '기배동', '화산동', '진안동'],
        '광주시': ['경안동', '송정동', '광남동', '오포읍', '초월읍', '곤지암읍', '도척면', '퇴촌면', '남종면', '남한산성면'],
        '양주시': ['백석읍', '은현면', '남면', '광적면', '장흥면', '양주동', '회천동'],
        '포천시': ['소흘읍', '군내면', '내촌면', '가산면', '신북면', '창수면', '영중면', '일동면', '이동면', '영북면', '관인면', '화현면', '포천동', '선단동'],
        '여주시': ['여흥동', '중앙동', '오학동', '가남읍', '점동면', '세종대왕면', '흥천면', '금사면', '산북면', '대신면', '북내면', '강천면'],
        '연천군': ['연천읍', '전곡읍', '군남면', '청산면', '백학면', '미산면', '왕징면', '신서면', '중면', '장남면'],
        '가평군': ['가평읍', '설악면', '청평면', '상면', '조종면', '북면'],
        '양평군': ['양평읍', '강상면', '강하면', '양서면', '옥천면', '서종면', '단월면', '청운면', '양동면', '지평면', '용문면', '개군면']
    },
    '강원특별자치도': {
        '춘천시': ['신북읍', '동면', '동산면', '신동면', '남면', '서면', '사북면', '북산면', '소양동', '교동', '조운동', '약사명동', '근화동', '후평동', '효자동', '석사동', '퇴계동', '강남동', '신사우동'],
        '원주시': ['문막읍', '소초면', '호저면', '지정면', '부론면', '귀래면', '흥업면', '판부면', '신림면', '중앙동', '원인동', '개운동', '명륜동', '단구동', '일산동', '학성동', '단계동', '우산동', '태장동', '봉산동', '무실동', '반곡관설동'],
        '강릉시': ['주문진읍', '성산면', '왕산면', '구정면', '강동면', '옥계면', '사천면', '연곡면', '홍제동', '중앙동', '옥천동', '교동', '포남동', '초당동', '송정동', '내곡동', '강남동', '성덕동', '경포동'],
        '동해시': ['천곡동', '송정동', '북삼동', '부곡동', '동호동', '발한동', '묵호동', '망상동', '삼화동'],
        '태백시': ['황지동', '황연동', '삼수동', '상장동', '문곡소도동', '장성동', '구문소동', '철암동'],
        '속초시': ['영랑동', '동명동', '금호동', '교동', '노학동', '조양동', '청호동', '대포동'],
        '삼척시': ['도계읍', '원덕읍', '근덕면', '하장면', '노곡면', '미로면', '가곡면', '신기면', '남양동', '성내동', '교동', '정라동'],
        '홍천군': ['홍천읍', '화촌면', '두촌면', '내촌면', '서석면', '동면', '남면', '서면', '북방면', '내면'],
        '횡성군': ['횡성읍', '우천면', '안흥면', '둔내면', '갑천면', '청일면', '공근면', '서원면', '강림면'],
        '영월군': ['영월읍', '상동읍', '산솔면', '김삿갓면', '북면', '남면', '한반도면', '주천면', '무릉도원면'],
        '평창군': ['평창읍', '미탄면', '방림면', '대화면', '봉평면', '용평면', '진부면', '대관령면'],
        '정선군': ['정선읍', '고한읍', '사북읍', '신동읍', '남면', '북평면', '임계면', '화암면', '여량면'],
        '철원군': ['철원읍', '김화읍', '갈말읍', '동송읍', '서면', '근남면', '근북면', '근동면', '원남면', '원동면', '임남면'],
        '화천군': ['화천읍', '간동면', '하남면', '상서면', '사내면'],
        '양구군': ['양구읍', '국토정중앙면', '동면', '방산면', '해안면'],
        '인제군': ['인제읍', '북면', '서화면', '남면', '기린면', '상남면'],
        '고성군': ['간성읍', '거진읍', '현내면', '죽왕면', '토성면', '수동면'],
        '양양군': ['양양읍', '서면', '손양면', '현북면', '현남면', '강현면']
    },
    '충청북도': {
        '청주시': ['낭성면', '미원면', '가덕면', '남일면', '문의면', '중앙동', '성안동', '탑대성동', '영운동', '금천동', '용담명암산성동', '용암동', '오창읍', '내수읍', '북이면', '우암동', '내덕동', '율량사천동', '오근장동', '운천신봉동', '복대동', '가경동', '강서동', '흥덕구', '옥산면', '사직동', '사창동', '모충동', '분평동', '산남동', '수곡동', '성안동'],
        '충주시': ['주덕읍', '살미면', '수안보면', '대소원면', '신니면', '노은면', '앙성면', '중앙탑면', '금가면', '동량면', '산척면', '엄정면', '소태면', '성내충인동', '교현안림동', '교현2동', '용산동', '지현동', '문화동', '호암직동', '달천동', '봉방동', '칠금금릉동', '연수동', '목행용탄동'],
        '제천시': ['봉양읍', '금성면', '청풍면', '수산면', '덕산면', '한수면', '백운면', '송학면', '의림지동', '중앙동', '남현동', '영서동', '용두동', '화산동', '교동'],
        '보은군': ['보은읍', '속리산면', '장안면', '마로면', '탄부면', '삼승면', '수한면', '회남면', '회인면', '내북면', '산외면'],
        '옥천군': ['옥천읍', '동이면', '안남면', '안내면', '청성면', '청산면', '이원면', '군서면', '군북면'],
        '영동군': ['영동읍', '용산면', '황간면', '추풍령면', '매곡면', '상촌면', '양강면', '용화면', '학산면', '양산면', '심천면'],
        '증평군': ['증평읍', '도안면'],
        '진천군': ['진천읍', '덕산읍', '초평면', '문백면', '백곡면', '이월면', '광혜원면'],
        '괴산군': ['괴산읍', '감물면', '장연면', '연풍면', '칠성면', '문광면', '청천면', '청안면', '사리면', '소수면', '불정면'],
        '음성군': ['음성읍', '금왕읍', '소이면', '원남면', '맹동면', '대소면', '삼성면', '생극면', '감곡면'],
        '단양군': ['단양읍', '매포읍', '대강면', '가곡면', '영춘면', '어상천면', '적성면', '단성면']
    },
    '충청남도': {
        '천안시': ['풍세면', '광덕면', '목천읍', '북면', '성남면', '수신면', '병천면', '동면', '중앙동', '문성동', '원성동', '선구동', '신안동', '청룡동', '성환읍', '성거읍', '직산읍', '입장면', '성정동', '부성동', '쌍용동', '불당동', '백석동'],
        '공주시': ['이인면', '탄천면', '계룡면', '반포면', '의당면', '정안면', '우성면', '사곡면', '신풍면', '유구읍', '중학동', '웅진동', '금학동', '옥룡동', '신관동', '월송동'],
        '보령시': ['웅천읍', '주포면', '주교면', '오천면', '천북면', '청소면', '청라면', '남포면', '주산면', '미산면', '성주면', '대천동'],
        '아산시': ['염치읍', '배방읍', '송악면', '탕정면', '음봉면', '둔포면', '영인면', '인주면', '선장면', '도고면', '신창면', '온양동'],
        '서산시': ['대산읍', '인지면', '부석면', '팔봉면', '지곡면', '성연면', '음암면', '운산면', '해미면', '고북면', '부춘동', '동문동', '수석동', '석남동'],
        '논산시': ['강경읍', '연무읍', '성동면', '광석면', '노성면', '상월면', '부적면', '연산면', '벌곡면', '양촌면', '가야곡면', '은진면', '채운면', '취암동', '부창동'],
        '계룡시': ['두마면', '엄사면', '신도안면', '금암동'],
        '당진시': ['합덕읍', '송악읍', '고대면', '석문면', '대호지면', '정미면', '면천면', '순성면', '우강면', '신평면', '송산면', '당진동', '대덕동', '송산동'],
        '금산군': ['금산읍', '금성면', '제원면', '부리면', '군북면', '남일면', '남이면', '진산면', '복수면', '추부면'],
        '부여군': ['부여읍', '규암면', '은산면', '외산면', '내산면', '구룡면', '홍산면', '옥산면', '남면', '충화면', '양화면', '임천면', '장암면', '세도면', '석성면', '초촌면'],
        '서천군': ['장항읍', '서천읍', '마서면', '화양면', '기산면', '한산면', '마산면', '시초면', '문산면', '판교면', '종천면', '비인면', '서면'],
        '청양군': ['청양읍', '운곡면', '대치면', '정산면', '목면', '청남면', '장평면', '남양면', '화성면', '비봉면'],
        '홍성군': ['홍성읍', '광천읍', '홍북읍', '금마면', '홍동면', '장곡면', '은하면', '결성면', '서부면', '갈산면', '구항면'],
        '예산군': ['예산읍', '삽교읍', '대술면', '신양면', '광시면', '대흥면', '응봉면', '덕산면', '봉산면', '고덕면', '신암면', '오가면'],
        '태안군': ['태안읍', '안면읍', '고남면', '남면', '근흥면', '소원면', '원북면', '이원면']
    },
    '전북특별자치도': {
        '전주시': ['완산동', '중앙동', '풍남동', '노송동', '덕진동', '금암동', '인후동', '송천동', '조촌동', '동산동', '팔복동', '우아동', '호성동', '서신동', '삼천동', '효자동', '평화동', '중화산동', '서서학동'],
        '군산시': ['옥구읍', '옥산면', '임피면', '서수면', '개정면', '성산면', '나포면', '옥도면', '옥서면', '해신동', '월명동', '신풍동', '삼학동', '중앙동', '흥남동', '조촌동', '경암동', '구암동', '개정동', '수송동', '나운동', '소룡동', '미성동'],
        '익산시': ['함열읍', '오산면', '황등면', '함라면', '웅포면', '성당면', '용안면', '낭산면', '망성면', '여산면', '금마면', '왕궁면', '춘포면', '삼기면', '용동면', '중앙동', '평화동', '인화동', '동산동', '마동', '남중동', '모현동', '송학동', '영등동', '어양동', '팔봉동', '삼성동'],
        '정읍시': ['신태인읍', '북면', '입암면', '소성면', '고부면', '영원면', '덕천면', '이평면', '정우면', '태인면', '감곡면', '옹동면', '칠보면', '산내면', '산외면', '수성동', '장명동', '내장상동', '시기동', '초산동', '연지동', '농소동', '상교동'],
        '남원시': ['운봉읍', '주천면', '수지면', '송동면', '주생면', '금지면', '대강면', '대산면', '사매면', '덕과면', '보절면', '산동면', '이백면', '아영면', '산내면', '인월면', '동충동', '죽항동', '노암동', '금동', '왕정동', '향교동', '도통동'],
        '김제시': ['만경읍', '죽산면', '백산면', '용지면', '백구면', '부량면', '공덕면', '청하면', '성덕면', '진봉면', '금구면', '봉남면', '황산면', '금산면', '광활면', '요촌동', '신풍동', '검산동', '교월동'],
        '완주군': ['삼례읍', '봉동읍', '용진읍', '상관면', '이서면', '소양면', '구이면', '고산면', '비봉면', '운주면', '화산면', '동상면', '경천면'],
        '진안군': ['진안읍', '용담면', '안천면', '동향면', '상전면', '백운면', '성수면', '마령면', '부귀면', '정천면', '주천면'],
        '무주군': ['무주읍', '무풍면', '설천면', '적상면', '안성면', '부남면'],
        '장수군': ['장수읍', '산서면', '번암면', '장계면', '천천면', '계남면', '계북면'],
        '임실군': ['임실읍', '청웅면', '운암면', '신평면', '성수면', '오수면', '신덕면', '삼계면', '관촌면', '강진면', '덕치면', '지사면'],
        '순창군': ['순창읍', '인계면', '동계면', '적성면', '유등면', '풍산면', '금과면', '팔덕면', '복흥면', '쌍치면', '구림면'],
        '고창군': ['고창읍', '고수면', '아산면', '무장면', '공음면', '상하면', '해리면', '성송면', '대산면', '심원면', '흥덕면', '성내면', '신림면', '부안면'],
        '부안군': ['부안읍', '주산면', '동진면', '행안면', '계화면', '보안면', '변산면', '진서면', '백산면', '상서면', '하서면', '줄포면', '위도면']
    },
    '전라남도': {
        '목포시': ['용당동', '산정동', '연동', '상동', '하당동', '신흥동', '삼학동', '삼향동', '옥암동', '부흥동', '부주동', '원산동', '대성동', '목원동', '동명동', '만호동', '유달동', '죽교동', '북항동', '이로동'],
        '여수시': ['돌산읍', '소라면', '율촌면', '화양면', '남면', '화정면', '삼산면', '동문동', '한려동', '중앙동', '충무동', '광림동', '서강동', '대교동', '국동', '월호동', '여서동', '문수동', '미평동', '둔덕동', '만덕동', '쌍봉동', '시전동', '여천동', '주삼동', '삼일동', '묘도동'],
        '순천시': ['승주읍', '해룡면', '서면', '황전면', '월등면', '주암면', '송광면', '외서면', '낙안면', '별량면', '상사면', '향동', '매곡동', '삼산동', '조곡동', '덕연동', '풍덕동', '남제동', '저전동', '장천동', '중앙동', '도사동', '왕조동'],
        '나주시': ['남평읍', '세지면', '왕곡면', '반남면', '공산면', '동강면', '다시면', '문평면', '노안면', '금천면', '산포면', '다도면', '봉황면', '송월동', '영강동', '금남동', '성북동', '영산동', '이창동', '빛가람동'],
        '광양시': ['광양읍', '봉강면', '옥룡면', '옥곡면', '진상면', '진월면', '다압면', '골약동', '중마동', '광영동', '태인동', '금호동'],
        '담양군': ['담양읍', '봉산면', '고서면', '남면', '창평면', '대덕면', '무정면', '금성면', '용면', '월산면', '수북면', '대전면'],
        '곡성군': ['곡성읍', '오곡면', '삼기면', '석곡면', '목사동면', '죽곡면', '고달면', '옥과면', '입면', '겸면', '오산면'],
        '구례군': ['구례읍', '문척면', '간전면', '토지면', '마산면', '광의면', '용방면', '산동면'],
        '고흥군': ['고흥읍', '도양읍', '풍양면', '도덕면', '금산면', '도화면', '포두면', '봉래면', '점암면', '과역면', '남양면', '동강면', '대서면', '두원면', '영남면', '동일면'],
        '보성군': ['보성읍', '벌교읍', '노동면', '미력면', '겸백면', '율어면', '복내면', '문덕면', '조성면', '득량면', '회천면', '웅치면'],
        '화순군': ['화순읍', '한천면', '춘양면', '청풍면', '이양면', '능주면', '도곡면', '도암면', '이서면', '백아면', '동복면', '사평면', '동면'],
        '장흥군': ['장흥읍', '관산읍', '대덕읍', '용산면', '안양면', '장동면', '장평면', '유치면', '부산면', '회진면'],
        '강진군': ['강진읍', '군동면', '칠량면', '대구면', '마량면', '도암면', '신전면', '성전면', '작천면', '병영면', '옴천면'],
        '해남군': ['해남읍', '삼산면', '화산면', '현산면', '송지면', '북평면', '북일면', '옥천면', '계곡면', '마산면', '황산면', '산이면', '문내면', '화원면'],
        '영암군': ['영암읍', '삼호읍', '덕진면', '금정면', '신북면', '시종면', '도포면', '군서면', '서호면', '학산면', '미암면'],
        '무안군': ['무안읍', '일로읍', '삼향읍', '몽탄면', '청계면', '현경면', '망운면', '해제면', '운남면'],
        '함평군': ['함평읍', '손불면', '신광면', '학교면', '엄다면', '대동면', '나산면', '해보면', '월야면'],
        '영광군': ['영광읍', '백수읍', '홍농읍', '대마면', '묘량면', '불갑면', '군서면', '군남면', '염산면', '법성면', '낙월면'],
        '장성군': ['장성읍', '진원면', '남면', '동화면', '삼서면', '삼계면', '황룡면', '서삼면', '북일면', '북이면', '북하면'],
        '완도군': ['완도읍', '금일읍', '노화읍', '군외면', '신지면', '고금면', '약산면', '청산면', '소안면', '금당면', '보길면', '생일면'],
        '진도군': ['진도읍', '군내면', '고군면', '의신면', '임회면', '지산면', '조도면'],
        '신안군': ['지도읍', '압해읍', '증도면', '임자면', '자은면', '비금면', '도초면', '흑산면', '하의면', '신의면', '장산면', '안좌면', '팔금면', '암태면']
    },
    '경상북도': {
        '포항시': ['흥해읍', '연일읍', '오천읍', '대송면', '동해면', '장기면', '호미곶면', '구룡포읍', '상대동', '해도동', '송도동', '청림동', '제철동', '효곡동', '대이동', '중앙동', '양학동', '죽도동', '용흥동', '우창동', '두호동', '장량동', '환여동'],
        '경주시': ['감포읍', '안강읍', '건천읍', '외동읍', '양북면', '양남면', '내남면', '산내면', '서면', '현곡면', '강동면', '천북면', '중부동', '황오동', '성건동', '황남동', '선도동', '월성동', '용강동', '황성동', '동천동', '불국동', '보덕동'],
        '김천시': ['아포읍', '농소면', '남면', '개령면', '감문면', '어모면', '봉산면', '대항면', '감천면', '조마면', '구성면', '지례면', '부항면', '대덕면', '증산면', '자산동', '평화남산동', '양금동', '대신동', '대곡동', '지좌동', '율곡동'],
        '안동시': ['와룡면', '북후면', '서후면', '풍산읍', '풍천면', '일직면', '남후면', '남선면', '임하면', '길안면', '임동면', '예안면', '도산면', '녹전면', '중구동', '명륜동', '용상동', '옥동', '송하동', '강남동', '서구동', '태화동', '평화동', '안기동'],
        '구미시': ['선산읍', '고아읍', '무을면', '옥성면', '도개면', '해평면', '산동면', '장천면', '송정동', '원평동', '지산동', '도량동', '선주원남동', '형곡동', '신평동', '비산동', '공단동', '광평동', '상모사곡동', '임오동', '인동동', '진미동', '양포동'],
        '영주시': ['풍기읍', '이산면', '평은면', '문수면', '장수면', '안정면', '봉현면', '순흥면', '단산면', '부석면', '상망동', '하망동', '영주동', '휴천동', '가흥동'],
        '영천시': ['금호읍', '청통면', '신녕면', '화산면', '화북면', '화남면', '자양면', '임고면', '고경면', '북안면', '대창면', '중앙동', '동부동', '서부동', '완산동', '남부동'],
        '상주시': ['함창읍', '사벌국면', '중동면', '낙동면', '청리면', '공성면', '외남면', '내서면', '모동면', '모서면', '화동면', '화서면', '화북면', '외서면', '은척면', '공검면', '이안면', '화남면', '남원동', '북문동', '계림동', '동문동', '동성동', '신흥동'],
        '문경시': ['문경읍', '가은읍', '영순면', '산양면', '호계면', '산북면', '동로면', '마성면', '농암면', '점촌동'],
        '경산시': ['하양읍', '진량읍', '와촌면', '자인면', '용성면', '남산면', '압량면', '남천면', '중앙동', '동부동', '서부동', '남부동', '북부동', '중방동'],
        '의성군': ['의성읍', '단촌면', '점곡면', '옥산면', '사곡면', '춘산면', '가음면', '금성면', '봉양면', '비안면', '구천면', '단밀면', '단북면', '안계면', '다인면', '신평면', '안평면', '안사면'],
        '청송군': ['청송읍', '부동면', '부남면', '현동면', '현서면', '안덕면', '파천면', '진보면'],
        '영양군': ['영양읍', '입암면', '청기면', '일월면', '수비면', '석보면'],
        '영덕군': ['영덕읍', '강구면', '남정면', '달산면', '지품면', '축산면', '영해면', '병곡면', '창수면'],
        '봉화군': ['봉화읍', '물야면', '봉성면', '법전면', '춘양면', '소천면', '석포면', '재산면', '명호면', '상운면'],
        '울진군': ['울진읍', '평해읍', '북면', '금강송면', '근남면', '매화면', '기성면', '온정면', '죽변면', '후포면'],
        '울릉군': ['울릉읍', '서면', '북면'],
        '청도군': ['화양읍', '청도읍', '각남면', '풍각면', '각북면', '이서면', '운문면', '금천면', '매전면'],
        '고령군': ['대가야읍', '덕곡면', '운수면', '성산면', '다산면', '개진면', '우곡면', '쌍림면'],
        '성주군': ['성주읍', '선남면', '용암면', '수륜면', '가천면', '금수강산면', '대가면', '벽진면', '초전면', '월항면'],
        '칠곡군': ['왜관읍', '북삼읍', '석적읍', '지천면', '동명면', '가산면', '약목면', '기산면'],
        '예천군': ['예천읍', '용문면', '효자면', '은풍면', '감천면', '보문면', '호명면', '유천면', '용궁면', '개포면', '지보면', '풍양면']
    },
    '경상남도': {
        '창원시': ['동읍', '북면', '대산면', '의창동', '팔룡동', '명곡동', '봉림동', '용지동', '성산동', '상남동', '사파동', '가음정동', '성주동', '중앙동', '반송동', '웅남동', '내서읍', '구산면', '진동면', '진북면', '진전면', '현동', '가포동', '월영동', '문화동', '반월중앙동', '완월동', '중앙동', '교방동', '노산동', '오동동', '합포동', '산호동', '회원동', '석전동', '회성동', '양덕동', '합성동', '구암동', '봉암동', '진해구'],
        '진주시': ['문산읍', '내동면', '정촌면', '금곡면', '진성면', '일반성면', '이반성면', '사봉면', '지수면', '대곡면', '금산면', '집현면', '미천면', '명석면', '대평면', '수곡면', '천전동', '성북동', '중앙동', '상봉동', '상대동', '하대동', '상평동', '초장동', '진주동', '가호동', '충무공동', '판문동', '평거동', '신안동', '이현동'],
        '통영시': ['산양읍', '용남면', '도산면', '광도면', '욕지면', '한산면', '사량면', '도천동', '명정동', '중앙동', '정량동', '북신동', '무전동', '미수동', '봉평동'],
        '사천시': ['사천읍', '정동면', '사남면', '용현면', '축동면', '곤양면', '곤명면', '서포면', '동서동', '선구동', '동서금동', '벌용동', '향촌동', '남양동'],
        '김해시': ['진영읍', '장유동', '주촌면', '진례면', '한림면', '생림면', '상동면', '대동면', '동상동', '회현동', '부원동', '내외동', '북부동', '칠산서부동', '활천동', '삼안동', '불암동'],
        '밀양시': ['삼랑진읍', '하남읍', '부북면', '상동면', '산외면', '산내면', '단장면', '상남면', '초동면', '무안면', '청도면', '내일동', '내이동', '교동', '삼문동', '가곡동'],
        '거제시': ['신현읍', '일운면', '동부면', '남부면', '거제면', '둔덕면', '사등면', '연초면', '하청면', '장목면', '장승포동', '능포동', '옥포동', '아주동', '고현동', '상문동', '수양동'],
        '양산시': ['물금읍', '동면', '원동면', '상북면', '하북면', '중앙동', '양주동', '삼성동', '강서동', '서창동', '소주동', '평산동', '덕계동'],
        '의령군': ['의령읍', '가례면', '칠곡면', '대의면', '화정면', '용덕면', '정곡면', '지정면', '낙서면', '부림면', '봉수면', '궁류면', '유곡면'],
        '함안군': ['가야읍', '함안면', '군북면', '법수면', '대산면', '칠서면', '칠북면', '칠원읍', '산인면', '여항면'],
        '창녕군': ['창녕읍', '남지읍', '고암면', '성산면', '대합면', '이방면', '유어면', '대지면', '계성면', '영산면', '장마면', '도천면', '길곡면', '부곡면'],
        '고성군': ['고성읍', '삼산면', '하일면', '하이면', '상리면', '대가면', '영현면', '영오면', '개천면', '구만면', '회화면', '마암면', '동해면', '거류면'],
        '남해군': ['남해읍', '이동면', '상주면', '삼동면', '미조면', '남면', '서면', '고현면', '설천면', '창선면'],
        '하동군': ['하동읍', '화개면', '악양면', '적량면', '횡천면', '고전면', '금남면', '진교면', '양보면', '북천면', '청암면', '옥종면', '금성면'],
        '산청군': ['산청읍', '차황면', '오부면', '생초면', '금서면', '삼장면', '시천면', '단성면', '신안면', '생비량면', '신등면'],
        '함양군': ['함양읍', '마천면', '휴천면', '유림면', '수동면', '지곡면', '안의면', '서하면', '서상면', '백전면', '병곡면'],
        '거창군': ['거창읍', '주상면', '웅양면', '고제면', '북상면', '위천면', '마리면', '남상면', '남하면', '신원면', '가조면', '가북면'],
        '합천군': ['합천읍', '봉산면', '묘산면', '가야면', '야로면', '율곡면', '초계면', '쌍책면', '덕곡면', '청덕면', '적중면', '대양면', '쌍백면', '삼가면', '가회면', '대병면', '용주면']
    },
    '제주특별자치도': {
        '제주시': ['한림읍', '애월읍', '구좌읍', '조천읍', '한경면', '추자면', '우도면', '일도동', '이도동', '삼도동', '용담동', '건입동', '화북동', '삼양동', '봉개동', '아라동', '오라동', '연동', '노형동', '외도동', '이호동', '도두동'],
        '서귀포시': ['대정읍', '남원읍', '성산읍', '안덕면', '표선면', '송산동', '정방동', '중앙동', '천지동', '효돈동', '영천동', '동홍동', '서홍동', '대륜동', '대천동', '중문동', '예래동']
    }
};


const formatCurrency = (value: number | string) => {
    const num = Number(value);
    return isNaN(num) ? '0' : num.toLocaleString('ko-KR');
};

const parseCurrency = (value: string) => {
    return Number(value.replace(/,/g, '')) || 0;
};

// --- TYPE DEFINITIONS ---
interface Strategy {
    type: string;
    value: string;
    reasoning: string;
}

interface CostBreakdownItem {
    item_category: '수수료' | '광고비' | '프로모션' | '배달료';
    item_name: string;
    item_cost: number;
}

interface PlatformData {
    platform_name: string;
    strategies: Strategy[];
    policy_tip?: {
        title: string;
        description: string;
    };
    platform_expected_sales: number;
    platform_expected_orders: number;
    platform_expected_new_orders: number;
    platform_expected_returning_orders: number;
    cost_breakdown: CostBreakdownItem[];
}

interface CostAssumptions {
    material_and_packaging_cost?: number; // Made optional as it will be calculated on client
    labor_cost: number;
    rent_and_management_fee: number;
    utilities_and_misc_cost: number;
    reasoning: string;
}

interface StrategyScenario {
    goal: number;
    platforms: PlatformData[];
    cost_assumptions: CostAssumptions;
}

interface UserGoalAnalysis {
    expected_orders: number;
    estimated_aov: number;
}

interface RealisticAnalysis {
    realistic_goal: number;
    reasoning: string;
}

interface Recommendation {
    user_goal_analysis: UserGoalAnalysis;
    moonshot_goal: number;
    realistic_analysis: RealisticAnalysis;
    balanced: StrategyScenario;
    aggressive: StrategyScenario;
    cost_saving: StrategyScenario;
}


// --- MAIN APP COMPONENT ---

const App = () => {
    const [state, setState] = React.useState({
        locationName: localStorage.getItem(LOCATION_NAME_STORAGE_KEY) || '구로동점',
        goalInput: '1,500,000',
        apiKey: localStorage.getItem(API_KEY_STORAGE_KEY) || 'AIzaSyD32QP4IpVQtwoB5Qeoh-qfti7T-KQvs4Q',
        recommendation: null as Recommendation | null,
        activeStrategy: 'balanced' as 'balanced' | 'aggressive' | 'cost_saving',
        loading: false,
        error: null as string | null,
        currentSales: 0,
        orderCount: 0,
    });

    // --- PERFORMANCE OPTIMIZATION: CACHE DOM ELEMENTS ---
    const dashboardRefs = React.useRef({
        currentSales: null as HTMLSpanElement | null,
        orderCount: null as HTMLSpanElement | null,
        aov: null as HTMLSpanElement | null,
        lastWeekComparison: null as HTMLSpanElement | null,
        salesProgress: null as HTMLDivElement | null,
        progressLabel: null as HTMLSpanElement | null,
        alertsList: null as HTMLUListElement | null,
    });

    React.useEffect(() => {
        // Populate refs once on mount
        dashboardRefs.current = {
            currentSales: document.getElementById('current-sales') as HTMLSpanElement,
            orderCount: document.getElementById('order-count') as HTMLSpanElement,
            aov: document.getElementById('aov') as HTMLSpanElement,
            lastWeekComparison: document.getElementById('last-week-comparison') as HTMLSpanElement,
            salesProgress: document.getElementById('sales-progress') as HTMLDivElement,
            progressLabel: document.getElementById('progress-label') as HTMLSpanElement,
            alertsList: document.getElementById('alerts-list') as HTMLUListElement,
        };
    }, []);


    // --- LOCATION HANDLING ---
    const [selectedProvince, setSelectedProvince] = React.useState('서울특별시');
    const [selectedCity, setSelectedCity] = React.useState('구로구');
    const [selectedDong, setSelectedDong] = React.useState('신도림동');


    const updateDongOptions = React.useCallback((province: string, city: string, defaultDong?: string) => {
        const dongSelect = document.getElementById('dong-select') as HTMLSelectElement;
        const dongs = KOREAN_ADMIN_DIVISIONS[province]?.[city] || [];
        dongSelect.innerHTML = '';
        dongs.forEach(dong => {
            const option = document.createElement('option');
            option.value = dong;
            option.textContent = dong;
            dongSelect.appendChild(option);
        });
        if (defaultDong && dongs.includes(defaultDong)) {
            dongSelect.value = defaultDong;
        } else if (dongs.length > 0) {
            dongSelect.value = dongs[0];
        }
    }, []);

    const updateCityOptions = React.useCallback((province: string, defaultCity?: string) => {
        const citySelect = document.getElementById('city-select') as HTMLSelectElement;
        const cities = Object.keys(KOREAN_ADMIN_DIVISIONS[province] || {});
        citySelect.innerHTML = '';
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
        
        let cityToUpdateDongsFor = defaultCity;
        if (defaultCity && cities.includes(defaultCity)) {
            citySelect.value = defaultCity;
        } else if (cities.length > 0) {
            citySelect.value = cities[0];
            cityToUpdateDongsFor = cities[0];
        }

        if (cityToUpdateDongsFor) {
            updateDongOptions(province, cityToUpdateDongsFor);
        } else {
             updateDongOptions(province, ''); // Clear dongs if no city
        }
    }, [updateDongOptions]);

    React.useEffect(() => {
        const provinceSelect = document.getElementById('province-select') as HTMLSelectElement;
        const citySelect = document.getElementById('city-select') as HTMLSelectElement;
        const dongSelect = document.getElementById('dong-select') as HTMLSelectElement;

        // 1. Populate province select
        provinceSelect.innerHTML = '';
        Object.keys(KOREAN_ADMIN_DIVISIONS).forEach(province => {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinceSelect.appendChild(option);
        });
        
        // 2. Set initial state based on localStorage or defaults
        provinceSelect.value = selectedProvince;
        updateCityOptions(selectedProvince, selectedCity);
        updateDongOptions(selectedProvince, selectedCity, selectedDong);


        const handleProvinceChange = (e: Event) => {
            const newProvince = (e.target as HTMLSelectElement).value;
            setSelectedProvince(newProvince);
            updateCityOptions(newProvince);
            // After city options update, the first city is selected by default, so we need to get it
            const firstCity = Object.keys(KOREAN_ADMIN_DIVISIONS[newProvince] || {})[0] || '';
            setSelectedCity(firstCity);
            updateDongOptions(newProvince, firstCity);
            const firstDong = KOREAN_ADMIN_DIVISIONS[newProvince]?.[firstCity]?.[0] || '';
            setSelectedDong(firstDong);
            setState(prevState => ({ ...prevState, locationName: `${firstDong}점` }));
        };

        const handleCityChange = (e: Event) => {
            const newCity = (e.target as HTMLSelectElement).value;
            setSelectedCity(newCity);
            updateDongOptions(selectedProvince, newCity);
            const firstDong = KOREAN_ADMIN_DIVISIONS[selectedProvince]?.[newCity]?.[0] || '';
            setSelectedDong(firstDong);
            setState(prevState => ({ ...prevState, locationName: `${firstDong}점` }));
        };

        const handleDongChange = (e: Event) => {
            const newDong = (e.target as HTMLSelectElement).value;
            setSelectedDong(newDong);
            setState(prevState => ({ ...prevState, locationName: `${newDong}점` }));
        };

        provinceSelect.addEventListener('change', handleProvinceChange);
        citySelect.addEventListener('change', handleCityChange);
        dongSelect.addEventListener('change', handleDongChange);

        return () => {
            provinceSelect.removeEventListener('change', handleProvinceChange);
            citySelect.removeEventListener('change', handleCityChange);
            dongSelect.removeEventListener('change', handleDongChange);
        };
    }, [selectedProvince, selectedCity, selectedDong, updateCityOptions, updateDongOptions]);
    
    // Effects
    React.useEffect(() => {
        localStorage.setItem(LOCATION_NAME_STORAGE_KEY, state.locationName);
        document.title = `${state.locationName} 오늘의 배달 전략 어시스턴트`;
        const h1 = document.getElementById('app-title');
        if(h1) h1.textContent = `${state.locationName} 오늘의 배달 전략 어시스턴트`;
    }, [state.locationName]);


    React.useEffect(() => {
        // Simulate real-time dashboard updates
        const interval = setInterval(() => {
            setState(prevState => {
                if (prevState.loading || !prevState.recommendation) return prevState;
                const newOrderCount = prevState.orderCount + Math.floor(Math.random() * 3);
                const newSales = newOrderCount * (prevState.recommendation?.user_goal_analysis.estimated_aov || 21500);
                return { ...prevState, currentSales: newSales, orderCount: newOrderCount };
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []); // Run only once on mount
    

    // --- AI & Recommendation Logic ---
    const generateAiRecommendation = async (userGoal: number, location: string, apiKey: string): Promise<string> => {
        if (!apiKey) {
            throw new Error("API 키가 입력되지 않았습니다. 상단의 입력란에 유효한 Gemini API 키를 입력해주세요.");
        }
        const ai = new GoogleGenAI({ apiKey });
        
        const systemInstruction = `You are an expert AI assistant specializing in advertising and operational strategies for delivery platforms in South Korea. Your primary goal is to provide actionable, data-driven recommendations to restaurant owners.

**CRITICAL RULES:**
0.  **Serviceability Check First:** Before generating any strategies, you MUST first verify if each platform ('배달의민족', '쿠팡이츠', '요기요') provides adequate service to the specified '${location}'.
    *   **If a platform DOES NOT service the area:** You MUST NOT generate any strategies. Instead, for that platform's entry in the JSON, you MUST:
        *   Set \`strategies\` to a single object: \`{"type": "서비스 불가", "value": "해당 지역 서비스 미제공", "reasoning": "AI 분석 결과, 이 지역은 해당 플랫폼의 주력 서비스 권역이 아닐 가능성이 높습니다. 따라서 광고 전략을 수립하지 않습니다."}\`.
        *   Set all numerical performance fields and cost breakdowns to \`0\` or empty.
    *   **If a platform DOES service the area:** Proceed with the full analysis as described in the subsequent rules.
1.  **Language:** ALL text values in the final JSON output (e.g., 'type', 'value', 'reasoning', 'description', 'reasoning' for costs) MUST be in **Korean**.
2.  **Location-First Analysis:** ALL recommendations MUST be tailored to the specific characteristics of the user-provided location ('${location}'). Analyze its competitive landscape, demographics, and potential demand. This is the most important rule.
3.  **Justification Requirement:** If a recommended advertising cost is high, your 'reasoning' for that strategy MUST explicitly state WHY, referencing the specific local market conditions you analyzed (e.g., '도봉구는 주거 밀집 지역으로 경쟁이 치열하여, 신규 고객 확보를 위한 초기 광고비 투자가 높게 책정되었습니다').
4.  **Three-Tier Goal Setting:** You must perform three independent analyses based on the user's goal and location:
    *   **User Goal Analysis:** Based on the user's sales goal, you MUST calculate and return the \`user_goal_analysis\` object, containing the realistic \`expected_orders\` and \`estimated_aov\` required to achieve it in the '${location}' market.
    *   **Moonshot Goal:** Create a 'moonshot_goal' that is an ambitious yet achievable sales target, higher than the user's initial goal.
    *   **Realistic Goal:** Independent of the user's goal, you must create a 'realistic_analysis' object. The 'realistic_goal' within it must be based purely on the market data for the specified '${location}'. Provide a clear 'reasoning' for this realistic assessment.
5.  **Goal Consistency:** The 'moonshot_goal' is the primary target for the three scenarios (balanced, aggressive, cost_saving). The 'goal' value inside each of these scenarios MUST be identical to the top-level 'moonshot_goal' value.
6.  **Dynamic Cost Estimation & Specificity:** You MUST estimate business operating costs based on the '${location}' market with the following strict constraints:
    *   **Labor Cost (\`labor_cost\`):** Your calculation MUST be based on:
        *   Current Year: **2025**.
        *   2025 South Korean Minimum Wage: Assume **10,000 KRW/hour** for calculation.
        *   Operating Hours: **10:00 AM to 12:00 AM (midnight) - a 14-hour workday.**
        *   Staffing: Assume an appropriate number of staff (e.g., 1.5-2.0 FTE) to cover the 14-hour shift.
        *   You MUST include a prorated amount for **주휴수당 (weekly holiday allowance)**.
    *   **Fixed Costs (\`rent_and_management_fee\`, \`utilities_and_misc_cost\`):** You MUST first estimate the monthly cost, then **explicitly divide by 30** to calculate the daily prorated cost.
7.  **Provide Reasoning for Costs:** You MUST provide a detailed, logical reasoning for your cost estimations in the 'cost_assumptions.reasoning' field. **Your reasoning must explicitly mention the factors used in Rule #6** (e.g., "2025년 최저시급 10,000원과 14시간의 운영시간, 주휴수당을 고려하여... 월 임대료 XXX원을 30일로 나눈...").
8.  **Platform Policy Accuracy & Customer Mix Prediction:** Adhere strictly to the latest, real-world advertising models for each platform.
    *   **Baemin (배달의민족):** Has '오픈리스트' (6.8% commission, not an auction) and '우리가게클릭' (CPC bidding). You must differentiate them correctly.
    *   **Coupang Eats (쿠팡이츠) & Yogiyo (요기요):** When recommending a 'Two-Track' CPS strategy (separate rates for new/returning customers), you are **REQUIRED** to also predict the breakdown of total orders. You MUST provide **\`platform_expected_new_orders\`** and **\`platform_expected_returning_orders\`** for that platform. The sum of these two fields MUST equal the \`platform_expected_orders\`.
9.  **Holistic Strategy:** Also provide recommendations on improving operational UX metrics (ETA, ratings, etc.) that influence organic ranking.
10. **Granular & Actionable Cost Breakdown:** AVOID aggregated cost fields. Instead, you MUST provide a detailed breakdown in the **\`cost_breakdown\`** array. Each object in this array represents a SINGLE, specific cost item tied to a recommended strategy.
    *   **Every strategy that incurs a cost MUST have a corresponding entry in \`cost_breakdown\`.** This includes commissions, CPC bids (estimated total), promotions (estimated total), and delivery fees.
    *   Example: If you recommend '오픈리스트' and a '할인 쿠폰', the \`cost_breakdown\` MUST contain separate objects for each, with the correct category ('수수료', '프로모션').
11. **Output Format:** Your final output must be a single, valid JSON object, strictly following the provided schema. No markdown or extra text.`;

        // --- DEFINE RESPONSE SCHEMA ---
        const costBreakdownItemSchema = {
            type: GoogleGenAIType.OBJECT,
            properties: {
                item_category: { type: GoogleGenAIType.STRING, description: "비용 항목의 카테고리 ('수수료', '광고비', '프로모션', '배달료')" },
                item_name: { type: GoogleGenAIType.STRING, description: "비용 항목의 구체적인 이름 (예: '오픈리스트 (6.8%)')" },
                item_cost: { type: GoogleGenAIType.NUMBER, description: "해당 항목의 예상 비용(원)" },
            },
            required: ['item_category', 'item_name', 'item_cost'],
        };

        const strategySchema = {
            type: GoogleGenAIType.OBJECT,
            properties: {
                type: { type: GoogleGenAIType.STRING, description: "전략의 종류 (예: '광고 상품', '프로모션')" },
                value: { type: GoogleGenAIType.STRING, description: "전략의 구체적인 내용 (예: '우리가게클릭 (CPC)')" },
                reasoning: { type: GoogleGenAIType.STRING, description: "해당 전략을 추천하는 이유 (지역 상권 분석 기반)" },
            },
            required: ['type', 'value', 'reasoning'],
        };

        const policyTipSchema = {
            type: GoogleGenAIType.OBJECT,
            properties: {
                title: { type: GoogleGenAIType.STRING, description: "플랫폼 정책 관련 팁의 제목" },
                description: { type: GoogleGenAIType.STRING, description: "플랫폼 정책 관련 팁의 상세 설명" },
            },
            required: ['title', 'description'],
        };

        const platformDataSchema = {
            type: GoogleGenAIType.OBJECT,
            properties: {
                platform_name: { type: GoogleGenAIType.STRING, description: "플랫폼 이름 ('배달의민족', '쿠팡이츠', '요기요')" },
                strategies: {
                    type: GoogleGenAIType.ARRAY,
                    items: strategySchema,
                    description: "해당 플랫폼에 대한 구체적인 전략 목록"
                },
                policy_tip: policyTipSchema,
                platform_expected_sales: { type: GoogleGenAIType.NUMBER, description: "해당 플랫폼에서의 예상 매출액(원)" },
                platform_expected_orders: { type: GoogleGenAIType.NUMBER, description: "해당 플랫폼에서의 예상 총 주문 건수" },
                platform_expected_new_orders: { type: GoogleGenAIType.NUMBER, description: "예상 신규 고객 주문 건수 (CPS 이중 과금 전략 시 필수)" },
                platform_expected_returning_orders: { type: GoogleGenAIType.NUMBER, description: "예상 재주문 고객 주문 건수 (CPS 이중 과금 전략 시 필수)" },
                cost_breakdown: {
                    type: GoogleGenAIType.ARRAY,
                    items: costBreakdownItemSchema,
                    description: "해당 플랫폼에서 발생하는 모든 비용의 상세 내역"
                },
            },
            required: [
                'platform_name', 'strategies', 'platform_expected_sales',
                'platform_expected_orders', 'platform_expected_new_orders',
                'platform_expected_returning_orders', 'cost_breakdown'
            ],
        };

        const costAssumptionsSchema = {
            type: GoogleGenAIType.OBJECT,
            properties: {
                labor_cost: { type: GoogleGenAIType.NUMBER, description: "AI가 추정한 일일 인건비" },
                rent_and_management_fee: { type: GoogleGenAIType.NUMBER, description: "AI가 추정한 일일 임대료 및 관리비" },
                utilities_and_misc_cost: { type: GoogleGenAIType.NUMBER, description: "AI가 추정한 일일 공과금 및 기타 비용" },
                reasoning: { type: GoogleGenAIType.STRING, description: "모든 비용 추정에 대한 상세한 근거" },
            },
            required: ['labor_cost', 'rent_and_management_fee', 'utilities_and_misc_cost', 'reasoning'],
        };


        const strategyScenarioSchema = {
            type: GoogleGenAIType.OBJECT,
            properties: {
                goal: { type: GoogleGenAIType.NUMBER, description: "해당 시나리오의 목표 매출액 (최상위 moonshot_goal과 동일해야 함)" },
                platforms: {
                    type: GoogleGenAIType.ARRAY,
                    items: platformDataSchema,
                    description: "각 플랫폼별 전략 및 분석 데이터 목록"
                },
                cost_assumptions: costAssumptionsSchema,
            },
            required: ['goal', 'platforms', 'cost_assumptions'],
        };

        const recommendationSchema = {
            type: GoogleGenAIType.OBJECT,
            properties: {
                user_goal_analysis: {
                    type: GoogleGenAIType.OBJECT,
                    properties: {
                        expected_orders: { type: GoogleGenAIType.NUMBER, description: "사용자 목표 달성을 위해 필요한 예상 주문 건수" },
                        estimated_aov: { type: GoogleGenAIType.NUMBER, description: "사용자 목표 달성을 위해 필요한 예상 평균 객단가" },
                    },
                    required: ['expected_orders', 'estimated_aov'],
                },
                moonshot_goal: { type: GoogleGenAIType.NUMBER, description: "AI가 제안하는 도전적인 '문샷' 목표 매출액" },
                realistic_analysis: {
                    type: GoogleGenAIType.OBJECT,
                    properties: {
                        realistic_goal: { type: GoogleGenAIType.NUMBER, description: "AI가 지역 상권 분석을 통해 판단한 현실적인 목표 매출액" },
                        reasoning: { type: GoogleGenAIType.STRING, description: "현실적 목표 매출액 산정 근거" },
                    },
                    required: ['realistic_goal', 'reasoning'],
                },
                balanced: strategyScenarioSchema,
                aggressive: strategyScenarioSchema,
                cost_saving: strategyScenarioSchema,
            },
            required: [
                'user_goal_analysis', 'moonshot_goal', 'realistic_analysis',
                'balanced', 'aggressive', 'cost_saving'
            ],
        };

        const userPrompt = `우리 가게 위치는 '${location}'이고, 오늘의 희망 목표 매출액은 ${formatCurrency(userGoal)}원 입니다. 이 정보를 바탕으로, 해당 지역 상권을 분석하여 균형, 공격적, 비용 절감 시나리오를 포함한 최적의 배달 전략을 한국어로 생성해주세요. 식자재 비용은 매출의 40%로 고정되므로 추정할 필요 없습니다.`;

        try {
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: recommendationSchema,
                }
            });
            return response.text;
        } catch (e) {
            console.error("Error calling Gemini API:", e);
            throw new Error("AI 추천 생성에 실패했습니다. API 호출 중 오류가 발생했습니다.");
        }
    };
    
    const parseAndValidateRecommendation = (jsonString: string): Recommendation => {
        let data;
        try {
            // Remove markdown backticks if they exist
            const cleanedJsonString = jsonString.replace(/^```json\s*|```\s*$/g, '');
            data = JSON.parse(cleanedJsonString);
        } catch (error) {
            console.error("Initial JSON parsing failed:", error);
            // Don't throw yet, attempt self-correction
            throw new Error("AI가 생성한 데이터 형식이 올바르지 않습니다. 다시 시도해주세요.");
        }

        // Basic validation
        if (!data.balanced?.goal || !data.aggressive?.platforms || !data.cost_saving?.cost_assumptions || !data.realistic_analysis?.realistic_goal || !data.user_goal_analysis) {
             console.error("Validation failed: Missing key properties in AI response.", data);
            throw new Error("AI 응답 데이터의 필수 항목이 누락되었습니다.");
        }
        return data as Recommendation;
    };


    const getRecommendation = React.useCallback(async () => {
        setState(prevState => ({ ...prevState, loading: true, error: null, recommendation: null }));
        hideAllCards(); // Hide cards before showing spinner
        document.getElementById('goal-estimation-details')!.classList.remove('visible');
    
        const outputDiv = document.getElementById('recommendation-output')!;
        outputDiv.innerHTML = `
            <div class="spinner-container">
                <div class="spinner"></div>
                <p id="loading-message"></p>
            </div>
        `;
        const loadingMessageElement = document.getElementById('loading-message');
        if (!loadingMessageElement) return;
    
        const loadingMessages = [
            `최신 배달 플랫폼 정책을 실시간으로 확인하는 중...`,
            `사장님 가게가 위치한 '${state.locationName}' 상권을 분석하고 있습니다...`,
            `경쟁 가게 데이터를 비교하여 최적의 전략을 도출합니다...`,
            `수익성 분석 및 최종 리포트를 생성하고 있습니다...`
        ];
        let messageIndex = 0;
    
        loadingMessageElement.innerHTML = loadingMessages[messageIndex];
    
        const messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            if (loadingMessageElement) {
                loadingMessageElement.innerHTML = loadingMessages[messageIndex];
            }
        }, 2800);
    
        if (!state.apiKey) {
            const errorMsg = 'API 키가 입력되지 않았습니다. 상단의 입력란에 유효한 Gemini API 키를 입력해주세요.';
            setState(prevState => ({ ...prevState, loading: false, error: errorMsg }));
            clearInterval(messageInterval);
            return;
        }

        try {
            const goalValue = parseCurrency(state.goalInput);
            if (isNaN(goalValue) || goalValue <= 0) {
                 throw new Error("유효한 목표를 설정해주세요.");
            }
            
            const jsonString = await generateAiRecommendation(goalValue, state.locationName, state.apiKey);
            const recommendationData = parseAndValidateRecommendation(jsonString);
            setState(prevState => ({ ...prevState, recommendation: recommendationData, loading: false }));

        } catch (error: any) {
            console.error("Error getting recommendation:", error);
            setState(prevState => ({ ...prevState, loading: false, error: error.message }));
        } finally {
            clearInterval(messageInterval);
        }
    }, [state.goalInput, state.locationName, state.apiKey]);

    // --- UI Rendering ---

    const renderUserGoalAnalysis = React.useCallback((analysis: UserGoalAnalysis) => {
        const container = document.getElementById('goal-estimation-details')!;
        container.innerHTML = `
            <p>AI 분석: <span>${formatCurrency(analysis.expected_orders)}건</span>의 주문과 <span>${formatCurrency(analysis.estimated_aov)}원</span>의 평균 객단가가 필요합니다.</p>
        `;
        container.classList.add('visible');
    }, []);

    const renderActiveStrategy = React.useCallback(() => {
        if (!state.recommendation) return;

        const activeData = state.recommendation[state.activeStrategy];
        const { platforms } = activeData;

        let platformsHtml = platforms.map(platform => {
            const strategiesHtml = platform.strategies.map(s => `
                <div class="strategy-item">
                    <div class="strategy-item-header">
                        <span class="type">${s.type}</span>
                        <span class="value">${s.value}</span>
                    </div>
                    <p class="reasoning">${s.reasoning}</p>
                </div>
            `).join('');

            const policyTipHtml = platform.policy_tip ? `
                <div class="policy-tip">
                    <h4>💡 ${platform.policy_tip.title}</h4>
                    <p>${platform.policy_tip.description}</p>
                </div>
            ` : '';
            
            const costBreakdownHtml = platform.cost_breakdown.map(item => `
                <div class="analysis-item">
                    <span class="analysis-label">
                        <span class="cost-item-category">[${item.item_category}]</span>
                        ${item.item_name}
                    </span>
                    <span class="analysis-value">${formatCurrency(item.item_cost)}원</span>
                </div>
            `).join('');

            const calculatedPlatformTotalCost = platform.cost_breakdown.reduce((sum, item) => sum + item.item_cost, 0);
            const costEfficiency = platform.platform_expected_sales > 0 ? ((calculatedPlatformTotalCost / platform.platform_expected_sales) * 100).toFixed(1) : 'N/A';
            
            const performanceHtml = `
                <div class="platform-costs">
                    <h3 class="platform-costs-header">${platform.platform_name} 성과 및 비용 분석</h3>
                    <div class="analysis-grid">
                        <!-- Performance -->
                        <div class="analysis-item performance">
                           <span class="analysis-label">예상 매출</span>
                           <span class="analysis-value">${formatCurrency(platform.platform_expected_sales)}원</span>
                        </div>
                        <div class="analysis-item performance">
                           <span class="analysis-label">예상 주문</span>
                           <span class="analysis-value">${formatCurrency(platform.platform_expected_orders)}건</span>
                        </div>
                        
                        <div class="analysis-separator"></div>

                        <!-- Costs -->
                        ${costBreakdownHtml}

                        <div class="analysis-separator"></div>

                        <!-- Total -->
                        <div class="analysis-item total">
                           <span class="analysis-label">플랫폼 총 비용</span>
                           <span class="analysis-value">
                                ${formatCurrency(calculatedPlatformTotalCost)}원
                                <span class="efficiency">비용 효율: ${costEfficiency}%</span>
                           </span>
                        </div>
                    </div>
                </div>
            `;

            return `
                <div class="platform-strategy-card">
                    <h3 class="platform-strategy-header">${platform.platform_name}</h3>
                    <div class="strategy-list">${strategiesHtml}</div>
                    ${policyTipHtml}
                    ${performanceHtml}
                </div>
            `;
        }).join('');
        
        const groundingSources = (state.recommendation as any).groundingSources;
        if(groundingSources && groundingSources.length > 0) {
            const sourcesHtml = groundingSources.map((source: any) => `
                <li><a href="${source.web.uri}" target="_blank" rel="noopener noreferrer">${source.web.title}</a></li>
            `).join('');
            platformsHtml += `
                <div class="grounding-sources card">
                    <h4>AI 분석 참고자료 (Google 검색)</h4>
                    <ul>${sourcesHtml}</ul>
                </div>
            `;
        }
        
        const realisticAnalysisHtml = `
            <div class="summary-item realistic">
                <span class="label">💡 AI 지역 현실성 분석</span>
                <span class="value">${formatCurrency(state.recommendation.realistic_analysis.realistic_goal)} 원</span>
                <p class="reasoning">${state.recommendation.realistic_analysis.reasoning}</p>
            </div>
        `;

        const outputDiv = document.getElementById('recommendation-output')!;
        outputDiv.innerHTML = `
            <div class="strategy-container">
                <div class="ai-goal-summary">
                    <div class="summary-item">
                        <span class="label">사장님 희망 목표</span>
                        <span class="value">${formatCurrency(parseCurrency(state.goalInput))} 원</span>
                    </div>
                    <div class="summary-item moonshot">
                        <span class="label">AI 문샷 목표</span>
                        <span class="value">${formatCurrency(state.recommendation.moonshot_goal)} 원</span>
                    </div>
                    ${realisticAnalysisHtml}
                </div>
                <div class="strategy-selector-container">
                    <button class="strategy-option ${state.activeStrategy === 'balanced' ? 'active' : ''}" data-strategy="balanced">균형 전략</button>
                    <button class="strategy-option ${state.activeStrategy === 'aggressive' ? 'active' : ''}" data-strategy="aggressive">공격적 마케팅</button>
                    <button class="strategy-option ${state.activeStrategy === 'cost_saving' ? 'active' : ''}" data-strategy="cost_saving">비용 절감</button>
                </div>
                ${platformsHtml}
            </div>
        `;
    }, [state.recommendation, state.activeStrategy, state.goalInput]);

    const renderDailyProjection = React.useCallback(() => {
        if (!state.recommendation) return;
        const activeData = state.recommendation[state.activeStrategy];
        const totalSales = activeData.goal;
        
        const totalPlatformCosts = activeData.platforms.reduce((sum, p) => 
            sum + p.cost_breakdown.reduce((s, item) => s + item.item_cost, 0), 0);

        const materialCost = totalSales * 0.4;

        const {
            labor_cost: laborCost,
            rent_and_management_fee: rent,
            utilities_and_misc_cost: utilities,
            reasoning
        } = activeData.cost_assumptions;
        
        const otherFixedCosts = rent + utilities;
        const totalExpenses = totalPlatformCosts + materialCost + laborCost + otherFixedCosts;
        const netProfit = totalSales - totalExpenses;
        const profitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

        const projectionContainer = document.getElementById('daily-projection-container')!;
        projectionContainer.innerHTML = `
            <table class="projection-table">
                <thead>
                    <tr>
                        <th>항목</th>
                        <th style="text-align: right;">예상 금액</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="category-header"><td colspan="2">매출</td></tr>
                    <tr><td>AI 추천 목표 매출</td><td>${formatCurrency(totalSales)} 원</td></tr>
                    
                    <tr class="category-header"><td colspan="2">변동 비용</td></tr>
                    <tr>
                        <td>플랫폼 총 비용 <span class="assumption">(AI 추천 전략 기반)</span></td>
                        <td>-${formatCurrency(totalPlatformCosts)} 원</td>
                    </tr>
                    <tr>
                        <td>식자재 및 포장 <span class="assumption">(매출의 40% 가정)</span></td>
                        <td>-${formatCurrency(materialCost)} 원</td>
                    </tr>
                    <tr>
                        <td>인건비 <span class="assumption">(AI 추정)</span></td>
                        <td>-${formatCurrency(laborCost)} 원</td>
                    </tr>

                    <tr class="category-header"><td colspan="2">고정 비용</td></tr>
                    <tr>
                        <td>임대료 및 관리비 <span class="assumption">(AI 추정, 일일 환산)</span></td>
                        <td>-${formatCurrency(rent)} 원</td>
                    </tr>
                    <tr>
                        <td>공과금 및 기타 <span class="assumption">(AI 추정, 일일 환산)</span></td>
                        <td>-${formatCurrency(utilities)} 원</td>
                    </tr>

                    <tr class="total-row"><td>총 비용 합계</td><td>-${formatCurrency(totalExpenses)} 원</td></tr>
                    <tr class="net-profit-row">
                        <td><strong>최종 예상 순이익</strong></td>
                        <td>
                            <strong>${formatCurrency(netProfit)} 원</strong>
                            <span class="profit-margin">(매출 대비 ${profitMargin.toFixed(1)}%)</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
        
        const reasoningContainer = document.getElementById('cost-assumption-reasoning-container')!;
        reasoningContainer.innerHTML = `
            <h4>AI 비용 가정 근거</h4>
            <p>${reasoning.replace(/\n/g, '<br>')}</p>
        `;
    }, [state.recommendation, state.activeStrategy]);
    
     const renderStrategySummary = React.useCallback(() => {
        if (!state.recommendation) return;

        const activeData = state.recommendation[state.activeStrategy];
        const totalSales = activeData.goal;
        const totalOrders = activeData.platforms.reduce((sum, p) => sum + p.platform_expected_orders, 0);

        let totalAdSpend = 0;
        let totalDeliveryFee = 0;
        let totalCommission = 0;
        let totalPromotion = 0;

        activeData.platforms.forEach(p => {
            p.cost_breakdown.forEach(item => {
                if(item.item_category === '광고비') totalAdSpend += item.item_cost;
                else if (item.item_category === '배달료') totalDeliveryFee += item.item_cost;
                else if (item.item_category === '수수료') totalCommission += item.item_cost;
                else if (item.item_category === '프로모션') totalPromotion += item.item_cost;
            });
        });
        
        const totalCost = totalAdSpend + totalDeliveryFee + totalCommission + totalPromotion;
        const costEfficiency = totalSales > 0 ? ((totalCost / totalSales) * 100).toFixed(1) : 'N/A';

        const summaryContainer = document.getElementById('strategy-summary-container')!;
        summaryContainer.innerHTML = `
            <div class="summary-column">
                <h3 class="performance">예상 성과</h3>
                <div class="summary-metric">
                    <span class="summary-metric-label">총 예상 매출</span>
                    <span class="summary-metric-value">${formatCurrency(totalSales)} 원</span>
                </div>
                <div class="summary-metric">
                    <span class="summary-metric-label">총 예상 주문 건수</span>
                    <span class="summary-metric-value">${formatCurrency(totalOrders)} 건</span>
                </div>
            </div>
            <div class="summary-column">
                <h3 class="costs">예상 비용</h3>
                 <div class="summary-metric">
                    <span class="summary-metric-label">[광고비/프로모션]</span>
                    <span class="summary-metric-value">${formatCurrency(totalAdSpend + totalPromotion)} 원</span>
                </div>
                 <div class="summary-metric">
                    <span class="summary-metric-label">[배달료]</span>
                    <span class="summary-metric-value">${formatCurrency(totalDeliveryFee)} 원</span>
                </div>
                 <div class="summary-metric">
                    <span class="summary-metric-label">[수수료]</span>
                    <span class="summary-metric-value">${formatCurrency(totalCommission)} 원</span>
                </div>
                <div class="summary-metric summary-total">
                    <span class="summary-metric-label">총 비용 합계</span>
                    <span class="summary-metric-value">
                        ${formatCurrency(totalCost)} 원
                        <span class="efficiency">비용 효율: ${costEfficiency}%</span>
                    </span>
                </div>
            </div>
        `;
    }, [state.recommendation, state.activeStrategy]);


    const hideAllCards = () => {
        document.getElementById('daily-projection-card')!.style.display = 'none';
        document.getElementById('strategy-summary-card')!.style.display = 'none';
    };

    const showAllCards = () => {
        document.getElementById('daily-projection-card')!.style.display = 'block';
        document.getElementById('strategy-summary-card')!.style.display = 'block';
    };
    
    // --- Dashboard Updates ---
    React.useEffect(() => {
        const { currentSales, orderCount, lastWeekComparison, salesProgress, progressLabel, alertsList, aov } = dashboardRefs.current;
        if (!currentSales || !orderCount || !lastWeekComparison || !salesProgress || !progressLabel || !alertsList || !aov) return;

        const targetGoal = state.recommendation ? state.recommendation[state.activeStrategy].goal : parseCurrency(state.goalInput) || 1;
        const progress = Math.min((state.currentSales / targetGoal) * 100, 100);

        currentSales.textContent = `${formatCurrency(state.currentSales)}원`;
        orderCount.textContent = `${formatCurrency(state.orderCount)}건`;
        aov.textContent = `${formatCurrency(state.orderCount > 0 ? state.currentSales / state.orderCount : 0)}원`;
        lastWeekComparison.textContent = `+${(progress / 10).toFixed(1)}%`; // Mock data

        salesProgress.style.width = `${progress}%`;
        progressLabel.textContent = `달성률 ${progress.toFixed(1)}%`;

        // Update alerts
        let alertHtml = '';
        if (!state.recommendation) {
            alertHtml = `<li><span class="dot yellow"></span>목표를 설정하고 AI 분석을 시작하여 맞춤 운영 알림을 받아보세요.</li>`;
        } else {
             const activeGoal = state.recommendation[state.activeStrategy].goal;
             const achievementRate = state.currentSales / activeGoal;
             
             if (achievementRate >= 0.95) {
                alertHtml = `<li><span class="dot green"></span>목표 달성 임박! 현재 페이스를 유지하세요. 아주 좋습니다!</li>`;
             } else if (achievementRate >= 0.7) {
                alertHtml = `<li><span class="dot yellow"></span>페이스가 약간 느립니다. 현재 선택하신 '${state.activeStrategy}' 전략에 따라, '우리가게클릭' 입찰가를 50원 상향 조정해보세요.</li>`;
             } else {
                alertHtml = `<li><span class="dot red"></span>목표 달성률이 저조합니다. '공격적 마케팅' 전략으로 전환하여 광고비를 증액하고, 1,000원 할인 쿠폰 발행을 고려해보세요.</li>`;
             }
        }
        alertsList.innerHTML = alertHtml;

    }, [state.currentSales, state.orderCount, state.recommendation, state.activeStrategy, state.goalInput]);

    
    // --- Event Listener Setup ---
    React.useEffect(() => {
        const getRecommendationBtn = document.getElementById('get-recommendation-btn')!;
        const salesGoalInput = document.getElementById('sales-goal') as HTMLInputElement;
        const increaseBtn = document.getElementById('increase-goal')!;
        const decreaseBtn = document.getElementById('decrease-goal')!;
        
        const handleGoalInputChange = (e: Event) => {
             const target = e.target as HTMLInputElement;
             const value = parseCurrency(target.value);
             const formattedValue = formatCurrency(value);
             setState(prevState => ({ ...prevState, goalInput: formattedValue }));
        };

        const adjustGoal = (amount: number) => {
            let currentValue = parseCurrency(state.goalInput);
            let newValue = currentValue + amount;
            if (newValue < 0) newValue = 0;
            const formattedNewValue = formatCurrency(newValue);
            setState(prevState => ({ ...prevState, goalInput: formattedNewValue }));
        };
        
        const handleIncreaseGoal = () => adjustGoal(100000);
        const handleDecreaseGoal = () => adjustGoal(-100000);
        const handleFocus = () => salesGoalInput.select();
        
        const getRecommendationHandler = () => getRecommendation();
        getRecommendationBtn.addEventListener('click', getRecommendationHandler);
        salesGoalInput.addEventListener('change', handleGoalInputChange);
        salesGoalInput.addEventListener('focus', handleFocus);
        increaseBtn.addEventListener('click', handleIncreaseGoal);
        decreaseBtn.addEventListener('click', handleDecreaseGoal);

        // Cleanup function
        return () => {
            getRecommendationBtn.removeEventListener('click', getRecommendationHandler);
            salesGoalInput.removeEventListener('change', handleGoalInputChange);
            salesGoalInput.removeEventListener('focus', handleFocus);
            increaseBtn.removeEventListener('click', handleIncreaseGoal);
            decreaseBtn.removeEventListener('click', handleDecreaseGoal);
        };

    }, [state.goalInput, state.locationName, getRecommendation]); 
    
    React.useEffect(() => {
        const apiKeyInput = document.getElementById('api-key-input') as HTMLInputElement;
        const toggleBtn = document.getElementById('toggle-api-key-btn');
        const apiKeyContainer = document.getElementById('api-key-container');

        if (apiKeyInput) {
            apiKeyInput.value = state.apiKey; // Set initial value
            const handleApiKeyChange = (e: Event) => {
                const newApiKey = (e.target as HTMLInputElement).value;
                setState(prevState => ({ ...prevState, apiKey: newApiKey }));
                localStorage.setItem(API_KEY_STORAGE_KEY, newApiKey);
            };
            apiKeyInput.addEventListener('input', handleApiKeyChange);

            if (toggleBtn && apiKeyContainer) {
                const handleToggle = () => {
                    apiKeyContainer.classList.toggle('visible');
                };
                toggleBtn.addEventListener('click', handleToggle);
    
                return () => {
                    apiKeyInput.removeEventListener('input', handleApiKeyChange);
                    toggleBtn.removeEventListener('click', handleToggle);
                };
            }

            return () => {
                apiKeyInput.removeEventListener('input', handleApiKeyChange);
            };
        }
    }, []); // Only run on mount to set up the listener

    React.useEffect(() => {
        if (!state.recommendation) return;

        const strategyButtons = document.querySelectorAll('.strategy-option');
        
        const handleStrategyClick = (e: Event) => {
            const strategy = (e.currentTarget as HTMLElement).dataset.strategy as 'balanced' | 'aggressive' | 'cost_saving';
            setState(prevState => ({ ...prevState, activeStrategy: strategy }));
        };

        strategyButtons.forEach(button => {
            button.addEventListener('click', handleStrategyClick);
        });

        return () => {
            strategyButtons.forEach(button => {
                button.removeEventListener('click', handleStrategyClick);
            });
        };
    }, [state.recommendation, state.activeStrategy]); 


    React.useEffect(() => {
        if (state.recommendation) {
            renderUserGoalAnalysis(state.recommendation.user_goal_analysis);
            renderActiveStrategy();
            renderDailyProjection();
            renderStrategySummary();
            showAllCards();
        }
        if (state.error) {
            const outputDiv = document.getElementById('recommendation-output')!;
            outputDiv.innerHTML = `<div class="error"><p><strong>오류가 발생했습니다:</strong></p><p>${state.error}</p></div>`;
            hideAllCards();
        }
    }, [state.recommendation, state.activeStrategy, state.error, renderActiveStrategy, renderDailyProjection, renderStrategySummary, renderUserGoalAnalysis]);
    
    React.useEffect(() => {
        const salesGoalInput = document.getElementById('sales-goal') as HTMLInputElement;
        salesGoalInput.value = state.goalInput;
    }, [state.goalInput]);

    React.useEffect(() => {
        const goalValue = parseCurrency(state.goalInput);
        const tag = document.getElementById('goal-feasibility-tag') as HTMLSpanElement;
        
        if (!goalValue || goalValue <= 0) {
            tag.className = '';
            tag.classList.remove('visible');
            return;
        }

        tag.classList.add('visible');
        if (goalValue < 1000000) {
            tag.textContent = '안정';
            tag.className = 'visible conservative';
        } else if (goalValue < 2000000) {
            tag.textContent = '보통';
            tag.className = 'visible moderate';
        } else {
            tag.textContent = '도전';
            tag.className = 'visible aggressive';
        }
    }, [state.goalInput]);

    return null; // This component manages the vanilla JS app logic
};

// Initial render
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}