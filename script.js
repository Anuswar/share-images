const fileList = document.querySelector(".file-list");
const fileUploadBox = document.querySelector(".file-upload-box");
const fileCompletedStatus = document.querySelector(".file-completed-status");

let totalFiles = 0;
let completedFiles = 0;

const createFileItemHTML = (file, uniqueIdentifier) => {
  const { name, size } = file;
  const extension = name.split(".").pop();
  const formattedFileSize =
    size >= 1024 * 1024
      ? `${(size / (1024 * 1024)).toFixed(2)} MB`
      : `${(size / 1024).toFixed(2)} KB`;

  return `<li class="file-item" id="file-item-${uniqueIdentifier}">
                <div class="file-extension">${extension}</div>
                <div class="file-content-wrapper">
                <div class="file-content">
                    <div class="file-details">
                    <h5 class="file-name">${name}</h5>
                    <div class="file-info">
                        <small class="file-size">0 MB / ${formattedFileSize}</small>
                        <small class="file-divider">•</small>
                        <small class="file-status">Uploading...</small>
                    </div>
                    </div>
                    <button class="cancel-button">
                    <i class="bx bx-x"></i>
                    </button>
                </div>
                <div class="file-progress-bar">
                    <div class="file-progress"></div>
                </div>
                </div>
            </li>`;
};

const handleFileUploading = (file, uniqueIdentifier) => {
  const fileReader = new FileReader();

  fileReader.onprogress = (e) => {
    const fileProgress = document.querySelector(
      `#file-item-${uniqueIdentifier} .file-progress`
    );
    const fileSize = document.querySelector(
      `#file-item-${uniqueIdentifier} .file-size`
    );

    const formattedFileSize =
      file.size >= 1024 * 1024
        ? `${(e.loaded / (1024 * 1024)).toFixed(2)} MB / ${(
            e.total /
            (1024 * 1024)
          ).toFixed(2)} MB`
        : `${(e.loaded / 1024).toFixed(2)} KB / ${(e.total / 1024).toFixed(
            2
          )} KB`;

    const progress = Math.round((e.loaded / e.total) * 100);
    fileProgress.style.width = `${progress}%`;
    fileSize.innerText = formattedFileSize;
  };

  fileReader.onloadend = () => {
    const currentFileItem = document.querySelector(
      `#file-item-${uniqueIdentifier}`
    );
    const cancelFileUploadButton =
      currentFileItem.querySelector(".cancel-button");
    cancelFileUploadButton.remove();
    const fileStatus = currentFileItem.querySelector(".file-status");
    fileStatus.innerText = "Completed";
    fileStatus.style.color = "#00B125";
    completedFiles++;
    fileCompletedStatus.innerText = `${completedFiles} / ${totalFiles} files completed`;
  };

  fileReader.onerror = () => {
    alert("An error occurred during the file upload!");
  };

  fileReader.readAsDataURL(file);
};

const handleSelectedFiles = (files) => {
  if (files.length === 0) return;

  // Filter out non-image files
  const imageFiles = [...files].filter((file) =>
    file.type.startsWith("image/")
  );

  if (imageFiles.length === 0) {
    alert("Please select only image files.");
    return;
  }

  totalFiles += imageFiles.length;

  imageFiles.forEach((file, index) => {
    const uniqueIdentifier = Date.now() + index;
    const fileItemHTML = createFileItemHTML(file, uniqueIdentifier);
    fileList.insertAdjacentHTML("afterbegin", fileItemHTML);
    handleFileUploading(file, uniqueIdentifier);
  });

  fileCompletedStatus.innerText = `${completedFiles} / ${totalFiles} files completed`;
};

fileUploadBox.addEventListener("drop", (e) => {
  e.preventDefault();
  handleSelectedFiles(e.dataTransfer.files);
  fileUploadBox.classList.remove("active");
});

fileUploadBox.addEventListener("dragover", (e) => {
  e.preventDefault();
  fileUploadBox.classList.add("active");
});

fileUploadBox.addEventListener("dragleave", (e) => {
  e.preventDefault();
  fileUploadBox.classList.remove("active");
});

fileUploadBox.addEventListener("click", () => {
  fileUploadBox.querySelector(".file-browse-input").click();
});

fileUploadBox
  .querySelector(".file-browse-input")
  .addEventListener("change", (e) => {
    handleSelectedFiles(e.target.files);
  });
