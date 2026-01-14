This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Google Sheets: lưu điểm (A → Z)

Project đã có sẵn phần gửi điểm qua HTTP POST trong [src/components/GamePage.tsx](src/components/GamePage.tsx) thông qua env `NEXT_PUBLIC_SHEETS_ENDPOINT`.

### 1) Tạo Google Sheet

1. Vào Google Drive → New → Google Sheets.
2. Đặt tên ví dụ: `BaoTangLichSu_Scores`.
3. Tạo 1 sheet/tab tên `Scores`.
4. (Khuyến nghị) Tạo header ở dòng 1:

	 - `at`
	 - `kind`
	 - `playerName`
	 - `sideTotalTimeMs`
	 - `sideAttempts`
	 - `mainTotalTimeMs`
	 - `mainAttempts`
	 - `userAgent`

### 2) Tạo Apps Script Web App (Webhook)

1. Trong Google Sheet: Extensions → Apps Script.
2. Xoá code mẫu, dán code dưới đây vào file `Code.gs`.
3. Sửa `SHEET_NAME` nếu bạn đặt tên tab khác.
4. (Tuỳ chọn) Đặt `TOKEN` để tránh ai có link cũng spam được.

```javascript
const SHEET_NAME = 'Scores';

// Optional simple auth. Leave as empty string to disable.
const TOKEN = ''; // e.g. 'my_secret_token'

function doPost(e) {
	try {
		const token = (e && e.parameter && e.parameter.token) ? String(e.parameter.token) : '';
		// Header access is limited in Apps Script web apps; prefer query token.
		if (TOKEN && token !== TOKEN) {
			return ContentService
				.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' }))
				.setMimeType(ContentService.MimeType.JSON);
		}

		const body = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
		const data = JSON.parse(body);

		const ss = SpreadsheetApp.getActiveSpreadsheet();
		const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

		const row = [
			data.at || new Date().toISOString(),
			data.kind || '',
			data.playerName || '',
			data.sideTotalTimeMs ?? '',
			data.sideAttempts ?? '',
			data.mainTotalTimeMs ?? '',
			data.mainAttempts ?? '',
			(e && e.parameter && e.parameter.ua) ? String(e.parameter.ua) : ''
		];

		sheet.appendRow(row);

		return ContentService
			.createTextOutput(JSON.stringify({ ok: true }))
			.setMimeType(ContentService.MimeType.JSON);
	} catch (err) {
		return ContentService
			.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
			.setMimeType(ContentService.MimeType.JSON);
	}
}
```

Ghi chú: Nếu bạn test bằng browser và gặp CORS, project hiện gửi request với `mode: "no-cors"` + `Content-Type: text/plain` nên **không cần** xử lý preflight/`doOptions()`.

### 3) Deploy Web App và lấy link

1. Apps Script: Deploy → New deployment.
2. Select type: Web app.
3. Execute as: **Me**.
4. Who has access: **Anyone** (hoặc “Anyone with Google account” nếu bạn muốn hạn chế).
5. Deploy → Authorize.
6. Copy **Web app URL**. Link thường dạng:

	 - `https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec`

### 4) Cấu hình vào Next.js

1. Tạo file `.env.local` trong folder [bao-tang-lich-su](.) (cùng cấp `package.json`).
2. Dán:

	 - `NEXT_PUBLIC_SHEETS_ENDPOINT=https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec`

	 Nếu bạn bật token ở Apps Script:

	 - `NEXT_PUBLIC_SHEETS_ENDPOINT=https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec?token=my_secret_token`

3. Restart dev server:

	 - `npm run dev`

### 5) Dữ liệu được gửi lên sheet

Project sẽ gửi JSON dạng (tuỳ loại score):

- Side score (sau khi xong map 2):

	- `kind: "side"`
	- `playerName`
	- `sideTotalTimeMs`
	- `sideAttempts`
	- `at` (ISO time)

- Main score (sau khi xong final):

	- `kind: "main"`
	- `playerName`
	- `mainTotalTimeMs`
	- `mainAttempts`
	- `at`

### 6) Test nhanh webhook (tuỳ chọn)

Bạn có thể test ngay bằng PowerShell:

```powershell
$url = "https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec"
$body = @{ kind = "side"; playerName = "Test"; sideTotalTimeMs = 12345; sideAttempts = 2; at = (Get-Date).ToString("o") } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri $url -ContentType "application/json" -Body $body
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
