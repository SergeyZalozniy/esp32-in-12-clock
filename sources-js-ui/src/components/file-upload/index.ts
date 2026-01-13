import uploadIcon from '@assets/upload-icon.svg';
import fileIcon from '@assets/file-icon.svg';
import closeIcon from '@assets/close-icon.svg';
import { translations } from '@utils/translate';
import { showErrorToast, showSuccessToast } from '@components/toast';
import { MAX_FILE_SIZE } from '@utils/constants.ts';
import { getLanguage } from '@utils/getLanguage.ts';
import { formatFileSize } from '@utils/formatFileSize.ts';

const render = (containerElement: HTMLElement): void => {
  const lang = getLanguage();
  const title = translations['file-upload']?.[lang] || 'File Upload';
  const description =
    translations['file-upload-desc']?.[lang] ||
    'Upload configuration files or firmware updates for your Nixie clock';
  const dragDropText =
    translations['drag-drop-file']?.[lang] || 'Drag and drop file here or click to select';
  const supportedFormats = translations['supported-formats']?.[lang] || 'Supported formats';
  const maxFileSize = translations['max-file-size']?.[lang] || 'Max file size';
  const uploadButtonText = translations['upload-file-button']?.[lang] || 'Upload File';

  containerElement.innerHTML = `
    <div class="settings-section">
      <h3 class="settings-section__title flex items-center gap-8" data-i18n="file-upload">
        <img src="${uploadIcon}" alt="${title}" class="settings-section__icon" width="20" height="20">
        ${title}
      </h3>
      <p class="settings-section__description" data-i18n="file-upload-desc">
        ${description}
      </p>

      <div class="file-upload">
        <div class="file-upload__area" id="dropArea">
          <img src="${fileIcon}" alt="File" class="file-upload__icon" width="48" height="48">
          <p class="file-upload__text" data-i18n="drag-drop-file">${dragDropText}</p>
          <p class="file-upload__hint">
            <span data-i18n="supported-formats">${supportedFormats}</span>: .zip, .bin <br>
            <span data-i18n="max-file-size">${maxFileSize}</span>: ${formatFileSize(MAX_FILE_SIZE)}
          </p>
          <input type="file" class="file-upload__input" id="fileInput" accept=".zip, .bin">
        </div>

        <div class="file-upload__selected flex items-center gap-12 justify-between" id="selectedFile" style="display: none;">
          <div class="file-upload__file-info flex items-center gap-12 flex-1">
            <img src="${fileIcon}" alt="File" class="file-upload__file-icon flex-shrink-0" width="24" height="24">
            <span class="file-upload__file-name" id="fileName"></span>
          </div>
          <span class="file-upload__file-size flex-shrink-0" id="fileSize"></span>
          <button class="file-upload__remove flex items-center justify-center flex-shrink-0" id="removeFile" type="button">
            <img src="${closeIcon}" alt="Remove" width="20" height="20">
          </button>
        </div>

        <button class="file-upload__button" id="uploadButton" disabled data-i18n="upload-file-button">
          ${uploadButtonText}
        </button>
      </div>
    </div>
  `;
};

export const initFileUpload = (containerElement: HTMLElement): void => {
  let fileInput: HTMLInputElement | null = null;
  let selectedFile: File | null = null;

  render(containerElement);

  const displaySelectedFile = (file: File): void => {
    const selectedFileDiv = containerElement.querySelector('#selectedFile') as HTMLElement;
    const fileNameSpan = containerElement.querySelector('#fileName') as HTMLElement;
    const fileSizeSpan = containerElement.querySelector('#fileSize') as HTMLElement;
    const uploadButton = containerElement.querySelector('#uploadButton') as HTMLButtonElement;

    if (selectedFileDiv && fileNameSpan && fileSizeSpan && uploadButton) {
      selectedFileDiv.style.display = 'flex';
      fileNameSpan.textContent = file.name;
      fileSizeSpan.textContent = formatFileSize(file.size);
      uploadButton.disabled = false;
    }
  };

  const removeFile = (): void => {
    selectedFile = null;
    const selectedFileDiv = containerElement.querySelector('#selectedFile') as HTMLElement;
    const uploadButton = containerElement.querySelector('#uploadButton') as HTMLButtonElement;

    if (selectedFileDiv && uploadButton) {
      selectedFileDiv.style.display = 'none';
      uploadButton.disabled = true;
    }

    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleFileSelect = (file: File): void => {
    const validExtensions = ['.zip', '.bin'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const lang = getLanguage();

    if (!validExtensions.includes(fileExtension)) {
      const errorTitle = translations['error-title']?.[lang] || 'Error';
      const errorMsg =
        translations['error-unsupported-format']?.[lang] ||
        'Unsupported file format. Please select a file with .zip or .bin extension';
      showErrorToast(errorTitle, errorMsg);
      if (fileInput) {
        fileInput.value = '';
      }
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      const errorTitle = translations['error-title']?.[lang] || 'Error';
      const errorMsg =
        translations['error-file-too-large']?.[lang] ||
        'File is too large. Maximum allowed size is';
      showErrorToast(errorTitle, `${errorMsg} ${formatFileSize(MAX_FILE_SIZE)}`);
      if (fileInput) {
        fileInput.value = '';
      }
      return;
    }

    selectedFile = file;
    displaySelectedFile(file);
  };

  const uploadFile = async (): Promise<void> => {
    if (!selectedFile) return;

    const lang = getLanguage();
    const uploadButton = containerElement.querySelector('#uploadButton') as HTMLButtonElement;
    const uploadingText = translations['uploading']?.[lang] || 'Uploading...';
    const uploadButtonText = translations['upload-file-button']?.[lang] || 'Upload File';

    if (uploadButton) {
      uploadButton.disabled = true;
      uploadButton.style.position = 'relative';
      uploadButton.style.overflow = 'hidden';
    }

    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.style.position = 'absolute';
    progressBar.style.left = '0';
    progressBar.style.top = '0';
    progressBar.style.height = '100%';
    progressBar.style.width = '0%';
    progressBar.style.backgroundColor = 'rgba(76, 175, 80, 0.3)';
    progressBar.style.transition = 'width 0.3s ease';
    progressBar.style.zIndex = '0';

    // Create text span for button text
    const buttonText = document.createElement('span');
    buttonText.style.position = 'relative';
    buttonText.style.zIndex = '1';
    buttonText.textContent = uploadingText;

    if (uploadButton) {
      uploadButton.innerHTML = '';
      uploadButton.appendChild(progressBar);
      uploadButton.appendChild(buttonText);
    }

    return new Promise((resolve, reject) => {
      // Capture selectedFile in closure to avoid null issues
      const fileToUpload = selectedFile;
      if (!fileToUpload) {
        reject(new Error('No file selected'));
        return;
      }

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          progressBar.style.width = `${percentComplete}%`;
          buttonText.textContent = `${uploadingText} ${Math.round(percentComplete)}%`;
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('File uploaded successfully:', fileToUpload.name);
          const successTitle = translations['success-title']?.[lang] || 'Success';
          const successMsg =
            translations['file-uploaded-success']?.[lang] || 'File uploaded successfully!';
          showSuccessToast(successTitle, `${successMsg}\n"${fileToUpload.name}"`);
          removeFile();
          resolve();
        } else {
          const errorTitle = translations['error-title']?.[lang] || 'Error';
          const errorMsg = translations['upload-error']?.[lang] || 'Upload error. Please try again.';
          showErrorToast(errorTitle, errorMsg);
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }

        // Reset button
        if (uploadButton) {
          uploadButton.innerHTML = uploadButtonText;
          uploadButton.disabled = false;
          uploadButton.style.position = '';
          uploadButton.style.overflow = '';
        }
      });

      xhr.addEventListener('error', () => {
        console.error('Upload error');
        const errorTitle = translations['error-title']?.[lang] || 'Error';
        const errorMsg = translations['upload-error']?.[lang] || 'Upload error. Please try again.';
        showErrorToast(errorTitle, errorMsg);

        // Reset button
        if (uploadButton) {
          uploadButton.innerHTML = uploadButtonText;
          uploadButton.disabled = false;
          uploadButton.style.position = '';
          uploadButton.style.overflow = '';
        }

        reject(new Error('Network error'));
      });

      xhr.addEventListener('abort', () => {
        console.log('Upload aborted');

        // Reset button
        if (uploadButton) {
          uploadButton.innerHTML = uploadButtonText;
          uploadButton.disabled = false;
          uploadButton.style.position = '';
          uploadButton.style.overflow = '';
        }

        reject(new Error('Upload aborted'));
      });

      // Create FormData and send
      const formData = new FormData();
      formData.append('update', fileToUpload, fileToUpload.name);

      xhr.open('POST', '/update', true);
      xhr.send(formData);
    });
  };

  const dropArea = containerElement.querySelector('#dropArea') as HTMLElement;
  const fileInputElement = containerElement.querySelector('#fileInput') as HTMLInputElement;
  const uploadButton = containerElement.querySelector('#uploadButton') as HTMLButtonElement;
  const removeFileButton = containerElement.querySelector('#removeFile') as HTMLButtonElement;

  fileInput = fileInputElement;

  if (dropArea && fileInputElement) {
    dropArea.addEventListener('click', () => fileInputElement.click());

    dropArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropArea.classList.add('file-upload__area--dragover');
    });

    dropArea.addEventListener('dragleave', () => {
      dropArea.classList.remove('file-upload__area--dragover');
    });

    dropArea.addEventListener('drop', (e) => {
      e.preventDefault();
      dropArea.classList.remove('file-upload__area--dragover');

      const files = e.dataTransfer?.files;

      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    });

    fileInputElement.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;

      if (target.files && target.files.length > 0) {
        handleFileSelect(target.files[0]);
      }
    });
  }

  if (uploadButton) {
    uploadButton.addEventListener('click', () => uploadFile());
  }

  if (removeFileButton) {
    removeFileButton.addEventListener('click', () => removeFile());
  }

  window.addEventListener('languageChanged', () => {
    const wasFileSelected = selectedFile !== null;
    const currentFile = selectedFile;

    render(containerElement);

    fileInput = containerElement.querySelector('#fileInput') as HTMLInputElement;

    if (wasFileSelected && currentFile) {
      displaySelectedFile(currentFile);
    }

    const newDropArea = containerElement.querySelector('#dropArea') as HTMLElement;
    const newFileInputElement = containerElement.querySelector('#fileInput') as HTMLInputElement;
    const newUploadButton = containerElement.querySelector('#uploadButton') as HTMLButtonElement;
    const newRemoveFileButton = containerElement.querySelector('#removeFile') as HTMLButtonElement;

    if (newDropArea && newFileInputElement) {
      newDropArea.addEventListener('click', () => newFileInputElement.click());

      newDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        newDropArea.classList.add('file-upload__area--dragover');
      });

      newDropArea.addEventListener('dragleave', () => {
        newDropArea.classList.remove('file-upload__area--dragover');
      });

      newDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        newDropArea.classList.remove('file-upload__area--dragover');

        const files = e.dataTransfer?.files;

        if (files && files.length > 0) {
          handleFileSelect(files[0]);
        }
      });

      newFileInputElement.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;

        if (target.files && target.files.length > 0) {
          handleFileSelect(target.files[0]);
        }
      });
    }

    if (newUploadButton) {
      newUploadButton.addEventListener('click', () => uploadFile());
    }

    if (newRemoveFileButton) {
      newRemoveFileButton.addEventListener('click', () => removeFile());
    }
  });
};
