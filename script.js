document.addEventListener('DOMContentLoaded', function () {
  fetch('sample.csv') // 同じフォルダにある sample.csv を読み込む
    .then(response => {
      if (!response.ok) {
        throw new Error('CSVファイルの読み込みに失敗しました。');
      }
      return response.text();
    })
    .then(csvText => {
      const data = parseCSV(csvText); // CSVをパース
      renderTable(data);             // テーブルを描画
    })
    .catch(error => {
      console.error(error.message);
    });
});

// CSVテキストを2次元配列に変換する関数
function parseCSV(csvText) {
  const rows = csvText.split('\n').map(row => row.split(',').map(cell => cell.trim()));
  return rows.filter(row => row.length > 1 || row[0] !== ""); // 空行を除去
}

// テーブルを描画する関数
function renderTable(data) {
  const table = document.getElementById('dataTable');
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  // テーブルの既存内容をクリア
  thead.innerHTML = '';
  tbody.innerHTML = '';

  if (data.length === 0) {
    alert("CSVファイルにデータがありません。");
    return;
  }

  // ヘッダー行の描画
  const headerRow = document.createElement('tr');
  data[0].forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // データ行の描画
  const tableNameIndex = 0; // テーブル名の列インデックス
  let previousTableName = null;
  let rowspanCount = 0;
  let cellToMerge = null;

  for (let i = 1; i < data.length; i++) {
    const row = document.createElement('tr');
    const currentTableName = data[i][tableNameIndex];

    // 1列目（テーブル名）の処理: セルを結合
    if (currentTableName === previousTableName) {
      rowspanCount++;
      if (cellToMerge) {
        cellToMerge.rowSpan = rowspanCount; // rowspanを更新
      }
    } else {
      // 結合が終了した場合、新しいセルを作成
      const td = document.createElement('td');
      td.textContent = currentTableName;
      td.rowSpan = 1;
      row.appendChild(td);
      cellToMerge = td; // このセルを次回以降の結合対象とする
      rowspanCount = 1;
    }

    // 2列目以降のセルを描画
    for (let j = 1; j < data[i].length; j++) {
      const td = document.createElement('td');
      td.textContent = data[i][j];
      row.appendChild(td);
    }

    // 前回のテーブル名を更新
    previousTableName = currentTableName;

    // 行を追加
    tbody.appendChild(row);
  }
}
