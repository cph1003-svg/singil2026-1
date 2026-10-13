function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('2026 학교폭력예방대회 제출 시스템')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

function uploadFile(data) {
  try {
    // 1. 폴더 ID 설정 (본인의 구글 드라이브 폴더 ID로 수정하세요)
    var FOLDER_IDS = {
      '종소리': '1e90UBSkWfIPnnM4gbzn0hpQQF41x3ysx',
      '시화': '1rWW_FzYQiUTT6WiLUgiY7DWn4HZnvmHa'
    };

    var category = data.category;
    var targetFolderId = FOLDER_IDS[category];
    
    if (!targetFolderId) {
      throw new Error("올바른 분야를 선택해주세요.");
    }

    // 2. 파일명 생성 (예: 1학년3반05번홍길동_종소리.mp3)
    // 번호가 한 자리일 경우 두 자리로 맞춰줍니다 (예: 5 -> 05)
    var formattedNum = String(data.number).padStart(2, '0');
    var newFileName = "1학년" + data.classNum + "반" + formattedNum + "번" + data.name + "." + data.fileExtension;

    // 3. 파일 생성 및 구글 드라이브 저장
    var folder = DriveApp.getFolderById(targetFolderId);
    var contentType = data.fileData.substring(5, data.fileData.indexOf(';base64'));
    var bytes = Utilities.base64Decode(data.fileData.substr(data.fileData.indexOf('base64,') + 7));
    var blob = Utilities.newBlob(bytes, contentType, newFileName);
    
    var file = folder.createFile(blob);

    return { success: true, fileName: file.getName() };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}
