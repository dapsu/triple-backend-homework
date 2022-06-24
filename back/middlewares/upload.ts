import * as multer from 'multer';

// 이미지 패스되도록 필터 정의
const imageFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb('image만 업로드 가능합니다!', false);
    }
};

// multer Disk Storage 엔진 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {   // 업로드된 파일 저장할 폴더 설정
        cb(null, __dirname + '/../public/images/');
    },
    filename: (req, file, cb) => {      // 대상 폴더 내의 파일 이름 설정
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const uploadFile = multer({
    storage: storage,
    fileFilter: imageFilter
});

export { uploadFile };