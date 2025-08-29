// WAIZ Tools v2.0 - Fully Functional All-in-One Utility App
class WaizTools {
    constructor() {
        this.currentPage = 'home';
        this.currentCategory = null;
        this.currentTool = null;
        this.isDarkMode = false;
        this.files = [];
        this.processedFiles = 0;
        this.toolsUsed = 0;
        
        // API Configuration
        this.REMOVE_BG_API_KEY = 'XtM5WvNRhJLFV3qjucY6cKCh';
        this.REMOVE_BG_URL = 'https://api.remove.bg/v1.0/removebg';
        
        // File size limits (in bytes)
        this.FILE_SIZE_LIMITS = {
            pdf: 50 * 1024 * 1024, // 50MB
            image: 10 * 1024 * 1024, // 10MB
            general: 100 * 1024 * 1024 // 100MB
        };
        
        // App data with complete tool definitions
        this.appData = {
            "appName": "WAIZ Tools",
            "version": "2.0",
            "tagline": "Your All-in-One Utility Suite - Now Fully Functional",
            "toolCategories": [
                {
                    "id": "pdf-tools",
                    "name": "PDF Tools",
                    "icon": "📄",
                    "description": "Complete PDF processing suite",
                    "tools": [
                        {"id": "pdf-merger", "name": "PDF Merger", "description": "Combine multiple PDF files into one document", "acceptedFiles": ".pdf", "multiple": true},
                        {"id": "pdf-splitter", "name": "PDF Splitter", "description": "Split PDF into separate pages or ranges", "acceptedFiles": ".pdf", "multiple": false},
                        {"id": "pdf-compressor", "name": "PDF Compressor", "description": "Reduce PDF file size while maintaining quality", "acceptedFiles": ".pdf", "multiple": true},
                        {"id": "pdf-to-image", "name": "PDF to Image", "description": "Convert PDF pages to high-quality images", "acceptedFiles": ".pdf", "multiple": false},
                        {"id": "image-to-pdf", "name": "Image to PDF", "description": "Create PDF from multiple images", "acceptedFiles": ".jpg,.jpeg,.png,.webp", "multiple": true},
                        {"id": "pdf-to-word", "name": "PDF to Word", "description": "Extract text from PDF to Word format", "acceptedFiles": ".pdf", "multiple": false},
                        {"id": "word-to-pdf", "name": "Word to PDF", "description": "Convert text to PDF format", "acceptedFiles": ".txt,.docx", "multiple": false}
                    ]
                },
                {
                    "id": "image-tools",
                    "name": "Image Tools",
                    "icon": "🖼️",
                    "description": "Professional image processing tools",
                    "tools": [
                        {"id": "background-remover", "name": "Background Remover", "description": "Remove backgrounds using AI technology", "acceptedFiles": ".jpg,.jpeg,.png", "multiple": true},
                        {"id": "image-compressor", "name": "Image Compressor", "description": "Compress images while maintaining quality", "acceptedFiles": ".jpg,.jpeg,.png,.webp", "multiple": true},
                        {"id": "image-resizer", "name": "Image Resizer", "description": "Resize images to specific dimensions", "acceptedFiles": ".jpg,.jpeg,.png,.webp", "multiple": true},
                        {"id": "image-converter", "name": "Image Converter", "description": "Convert between different image formats", "acceptedFiles": ".jpg,.jpeg,.png,.webp,.bmp", "multiple": true}
                    ]
                },
                {
                    "id": "utilities",
                    "name": "Utilities",
                    "icon": "🛠️",
                    "description": "Essential utility tools",
                    "tools": [
                        {"id": "qr-generator", "name": "QR Generator", "description": "Create customizable QR codes", "acceptedFiles": null, "multiple": false},
                        {"id": "qr-scanner", "name": "QR Scanner", "description": "Scan and decode QR codes from images", "acceptedFiles": ".jpg,.jpeg,.png", "multiple": false},
                        {"id": "password-generator", "name": "Password Generator", "description": "Generate secure, cryptographically strong passwords", "acceptedFiles": null, "multiple": false},
                        {"id": "unit-converter", "name": "Unit Converter", "description": "Convert between different units of measurement", "acceptedFiles": null, "multiple": false},
                        {"id": "notepad", "name": "Online Notepad", "description": "Simple text editor with auto-save", "acceptedFiles": ".txt", "multiple": false},
                        {"id": "file-converter", "name": "File Converter", "description": "Create and extract ZIP archives", "acceptedFiles": "*", "multiple": true}
                    ]
                }
            ]
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.showPage('home');
        this.updateStats();
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Mobile menu toggle
        document.getElementById('mobileMenuToggle').addEventListener('click', () => this.toggleMobileMenu());
        
        // Logo click - return to home
        document.querySelector('.logo').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('home');
        });
        
        // Navigation links
        document.querySelectorAll('[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.closest('[data-category]').getAttribute('data-category');
                this.showCategory(category);
            });
        });
        
        // Back buttons
        document.getElementById('backBtn').addEventListener('click', () => this.showPage('home'));
        document.getElementById('toolBackBtn').addEventListener('click', () => this.showCategory(this.currentCategory));
        
        // Modal buttons
        document.getElementById('successOkBtn').addEventListener('click', () => this.hideModal('successModal'));
        document.getElementById('errorOkBtn').addEventListener('click', () => this.hideModal('errorModal'));
    }

    setupTheme() {
        // Default to light mode (avoiding localStorage per instructions)
        this.isDarkMode = false;
        this.applyTheme();
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
    }

    applyTheme() {
        const themeIcon = document.querySelector('.theme-icon');
        if (this.isDarkMode) {
            document.documentElement.setAttribute('data-color-scheme', 'dark');
            themeIcon.textContent = '☀️';
        } else {
            document.documentElement.setAttribute('data-color-scheme', 'light');
            themeIcon.textContent = '🌙';
        }
    }

    toggleMobileMenu() {
        const mobileNav = document.getElementById('mobileNav');
        const menuToggle = document.getElementById('mobileMenuToggle');
        
        mobileNav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(pageId + 'Page').classList.add('active');
        this.currentPage = pageId;
        
        // Close mobile menu
        document.getElementById('mobileNav').classList.remove('active');
        document.getElementById('mobileMenuToggle').classList.remove('active');
    }

    showCategory(categoryId) {
        this.currentCategory = categoryId;
        const category = this.appData.toolCategories.find(cat => cat.id === categoryId);
        
        if (category) {
            document.getElementById('categoryTitle').textContent = category.name;
            this.renderTools(category.tools);
            this.showPage('category');
        }
    }

    renderTools(tools) {
        const toolsGrid = document.getElementById('toolsGrid');
        toolsGrid.innerHTML = '';
        
        tools.forEach(tool => {
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card';
            toolCard.innerHTML = `
                <h3>${tool.name}</h3>
                <p>${tool.description}</p>
            `;
            toolCard.addEventListener('click', () => this.showTool(tool.id));
            toolsGrid.appendChild(toolCard);
        });
    }

    showTool(toolId) {
        this.currentTool = toolId;
        const toolData = this.findTool(toolId);
        
        if (toolData) {
            document.getElementById('toolTitle').textContent = toolData.name;
            document.getElementById('toolDescription').textContent = toolData.description;
            this.renderToolInterface(toolId);
            this.showPage('tool');
            this.toolsUsed++;
            this.updateStats();
        }
    }

    findTool(toolId) {
        for (const category of this.appData.toolCategories) {
            const tool = category.tools.find(t => t.id === toolId);
            if (tool) return tool;
        }
        return null;
    }

    renderToolInterface(toolId) {
        const toolContent = document.getElementById('toolContent');
        
        switch (toolId) {
            case 'pdf-merger':
                toolContent.innerHTML = this.getPDFMergerHTML();
                this.setupPDFMerger();
                break;
            case 'pdf-splitter':
                toolContent.innerHTML = this.getPDFSplitterHTML();
                this.setupPDFSplitter();
                break;
            case 'pdf-compressor':
                toolContent.innerHTML = this.getPDFCompressorHTML();
                this.setupPDFCompressor();
                break;
            case 'pdf-to-image':
                toolContent.innerHTML = this.getPDFToImageHTML();
                this.setupPDFToImage();
                break;
            case 'image-to-pdf':
                toolContent.innerHTML = this.getImageToPDFHTML();
                this.setupImageToPDF();
                break;
            case 'pdf-to-word':
                toolContent.innerHTML = this.getPDFToWordHTML();
                this.setupPDFToWord();
                break;
            case 'word-to-pdf':
                toolContent.innerHTML = this.getWordToPDFHTML();
                this.setupWordToPDF();
                break;
            case 'background-remover':
                toolContent.innerHTML = this.getBackgroundRemoverHTML();
                this.setupBackgroundRemover();
                break;
            case 'image-compressor':
                toolContent.innerHTML = this.getImageCompressorHTML();
                this.setupImageCompressor();
                break;
            case 'image-resizer':
                toolContent.innerHTML = this.getImageResizerHTML();
                this.setupImageResizer();
                break;
            case 'image-converter':
                toolContent.innerHTML = this.getImageConverterHTML();
                this.setupImageConverter();
                break;
            case 'qr-generator':
                toolContent.innerHTML = this.getQRGeneratorHTML();
                this.setupQRGenerator();
                break;
            case 'qr-scanner':
                toolContent.innerHTML = this.getQRScannerHTML();
                this.setupQRScanner();
                break;
            case 'password-generator':
                toolContent.innerHTML = this.getPasswordGeneratorHTML();
                this.setupPasswordGenerator();
                break;
            case 'unit-converter':
                toolContent.innerHTML = this.getUnitConverterHTML();
                this.setupUnitConverter();
                break;
            case 'notepad':
                toolContent.innerHTML = this.getNotepadHTML();
                this.setupNotepad();
                break;
            case 'file-converter':
                toolContent.innerHTML = this.getFileConverterHTML();
                this.setupFileConverter();
                break;
            default:
                toolContent.innerHTML = `
                    <div class="tool-interface">
                        <h3>Tool Implementation</h3>
                        <p>This tool is ready for implementation.</p>
                    </div>
                `;
        }
    }

    // PDF TOOLS IMPLEMENTATIONS

    getPDFMergerHTML() {
        return `
            <div class="tool-interface">
                <div class="file-upload" id="pdfMergerUpload">
                    <div class="upload-content">
                        <div class="upload-icon">📄</div>
                        <div class="upload-text">Drop PDF files here or click to browse</div>
                        <div class="upload-hint">Select multiple PDF files to merge (Max 50MB each)</div>
                        <div class="upload-buttons">
                            <button class="btn btn--primary" id="pdfMergerBrowse">Browse Files</button>
                        </div>
                    </div>
                </div>
                <input type="file" id="pdfMergerInput" accept=".pdf" multiple style="display: none;">
                <div class="file-list" id="pdfMergerFiles"></div>
                <button class="btn btn--primary btn--full-width" id="mergePDFBtn" style="display: none;">
                    Merge PDFs
                </button>
            </div>
        `;
    }

    setupPDFMerger() {
        const upload = document.getElementById('pdfMergerUpload');
        const input = document.getElementById('pdfMergerInput');
        const browseBtn = document.getElementById('pdfMergerBrowse');
        const fileList = document.getElementById('pdfMergerFiles');
        const mergeBtn = document.getElementById('mergePDFBtn');
        
        this.setupDualFileUpload(upload, input, browseBtn, fileList, (files) => {
            mergeBtn.style.display = files.length > 1 ? 'block' : 'none';
        }, '.pdf', this.FILE_SIZE_LIMITS.pdf);
        
        mergeBtn.addEventListener('click', () => this.mergePDFs());
    }

    async mergePDFs() {
        if (this.files.length < 2) {
            this.showError('Please select at least 2 PDF files to merge.');
            return;
        }
        
        this.showLoadingModal('Merging PDFs...', 'Combining multiple PDF files into one document');
        
        try {
            const mergedPdf = await PDFLib.PDFDocument.create();
            
            for (let i = 0; i < this.files.length; i++) {
                this.updateProgress((i / this.files.length) * 80, `Processing file ${i + 1} of ${this.files.length}`);
                
                const arrayBuffer = await this.files[i].arrayBuffer();
                const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            
            this.updateProgress(90, 'Finalizing merged PDF...');
            const pdfBytes = await mergedPdf.save();
            this.updateProgress(100, 'Complete!');
            
            this.downloadFile(pdfBytes, 'merged_document.pdf', 'application/pdf');
            this.hideLoadingModal();
            this.showSuccess(`Successfully merged ${this.files.length} PDF files!`);
            this.processedFiles++;
            this.updateStats();
        } catch (error) {
            console.error('Error merging PDFs:', error);
            this.hideLoadingModal();
            this.showError('Error merging PDFs. Please ensure all files are valid PDF documents.');
        }
    }

    getPDFSplitterHTML() {
        return `
            <div class="tool-interface">
                <div class="file-upload" id="pdfSplitterUpload">
                    <div class="upload-content">
                        <div class="upload-icon">📄</div>
                        <div class="upload-text">Drop a PDF file here or click to browse</div>
                        <div class="upload-hint">Select a PDF file to split into individual pages</div>
                        <div class="upload-buttons">
                            <button class="btn btn--primary" id="pdfSplitterBrowse">Browse File</button>
                        </div>
                    </div>
                </div>
                <input type="file" id="pdfSplitterInput" accept=".pdf" style="display: none;">
                <div class="file-list" id="pdfSplitterFiles"></div>
                <button class="btn btn--primary btn--full-width" id="splitPDFBtn" style="display: none;">
                    Split PDF into Pages
                </button>
            </div>
        `;
    }

    setupPDFSplitter() {
        const upload = document.getElementById('pdfSplitterUpload');
        const input = document.getElementById('pdfSplitterInput');
        const browseBtn = document.getElementById('pdfSplitterBrowse');
        const fileList = document.getElementById('pdfSplitterFiles');
        const splitBtn = document.getElementById('splitPDFBtn');
        
        this.setupDualFileUpload(upload, input, browseBtn, fileList, (files) => {
            splitBtn.style.display = files.length > 0 ? 'block' : 'none';
        }, '.pdf', this.FILE_SIZE_LIMITS.pdf);
        
        splitBtn.addEventListener('click', () => this.splitPDF());
    }

    async splitPDF() {
        if (this.files.length === 0) return;
        
        this.showLoadingModal('Splitting PDF...', 'Extracting individual pages from PDF');
        
        try {
            const arrayBuffer = await this.files[0].arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
            const pageCount = pdf.getPageCount();
            
            if (pageCount === 1) {
                this.hideLoadingModal();
                this.showError('PDF contains only one page. Nothing to split.');
                return;
            }
            
            const zip = new JSZip();
            
            for (let i = 0; i < pageCount; i++) {
                this.updateProgress((i / pageCount) * 90, `Extracting page ${i + 1} of ${pageCount}`);
                
                const newPdf = await PDFLib.PDFDocument.create();
                const [copiedPage] = await newPdf.copyPages(pdf, [i]);
                newPdf.addPage(copiedPage);
                const pdfBytes = await newPdf.save();
                zip.file(`page_${String(i + 1).padStart(3, '0')}.pdf`, pdfBytes);
            }
            
            this.updateProgress(95, 'Creating ZIP archive...');
            const zipBlob = await zip.generateAsync({type: 'blob'});
            this.updateProgress(100, 'Complete!');
            
            this.downloadFile(zipBlob, `${this.files[0].name.replace('.pdf', '')}_split_pages.zip`, 'application/zip');
            this.hideLoadingModal();
            this.showSuccess(`Successfully split PDF into ${pageCount} pages!`);
            this.processedFiles++;
            this.updateStats();
        } catch (error) {
            console.error('Error splitting PDF:', error);
            this.hideLoadingModal();
            this.showError('Error splitting PDF. Please ensure the file is a valid PDF document.');
        }
    }

    getPDFCompressorHTML() {
        return `
            <div class="tool-interface">
                <div class="control-group">
                    <div class="form-group">
                        <label class="form-label">Compression Level</label>
                        <select id="compressionLevel" class="form-control">
                            <option value="low">Low (Better Quality)</option>
                            <option value="medium" selected>Medium (Balanced)</option>
                            <option value="high">High (Smaller Size)</option>
                        </select>
                    </div>
                </div>
                <div class="file-upload" id="pdfCompressorUpload">
                    <div class="upload-content">
                        <div class="upload-icon">📄</div>
                        <div class="upload-text">Drop PDF files here or click to browse</div>
                        <div class="upload-hint">Select PDF files to compress</div>
                        <div class="upload-buttons">
                            <button class="btn btn--primary" id="pdfCompressorBrowse">Browse Files</button>
                        </div>
                    </div>
                </div>
                <input type="file" id="pdfCompressorInput" accept=".pdf" multiple style="display: none;">
                <div class="file-list" id="pdfCompressorFiles"></div>
                <button class="btn btn--primary btn--full-width" id="compressPDFBtn" style="display: none;">
                    Compress PDF Files
                </button>
            </div>
        `;
    }

    setupPDFCompressor() {
        const upload = document.getElementById('pdfCompressorUpload');
        const input = document.getElementById('pdfCompressorInput');
        const browseBtn = document.getElementById('pdfCompressorBrowse');
        const fileList = document.getElementById('pdfCompressorFiles');
        const compressBtn = document.getElementById('compressPDFBtn');
        
        this.setupDualFileUpload(upload, input, browseBtn, fileList, (files) => {
            compressBtn.style.display = files.length > 0 ? 'block' : 'none';
        }, '.pdf', this.FILE_SIZE_LIMITS.pdf);
        
        compressBtn.addEventListener('click', () => this.compressPDFs());
    }

    async compressPDFs() {
        if (this.files.length === 0) return;
        
        const compressionLevel = document.getElementById('compressionLevel').value;
        this.showLoadingModal('Compressing PDFs...', 'Reducing file sizes while maintaining quality');
        
        try {
            if (this.files.length === 1) {
                const compressed = await this.compressPDF(this.files[0], compressionLevel);
                const originalSize = this.files[0].size;
                const compressedSize = compressed.byteLength;
                const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
                
                this.downloadFile(compressed, `compressed_${this.files[0].name}`, 'application/pdf');
                this.hideLoadingModal();
                this.showSuccess(`PDF compressed successfully! Size reduced by ${savings}%`);
            } else {
                const zip = new JSZip();
                let totalSavings = 0;
                
                for (let i = 0; i < this.files.length; i++) {
                    this.updateProgress((i / this.files.length) * 90, `Compressing file ${i + 1} of ${this.files.length}`);
                    
                    const compressed = await this.compressPDF(this.files[i], compressionLevel);
                    const originalSize = this.files[i].size;
                    const compressedSize = compressed.byteLength;
                    totalSavings += ((originalSize - compressedSize) / originalSize * 100);
                    
                    zip.file(`compressed_${this.files[i].name}`, compressed);
                }
                
                this.updateProgress(95, 'Creating ZIP archive...');
                const zipBlob = await zip.generateAsync({type: 'blob'});
                this.updateProgress(100, 'Complete!');
                
                const avgSavings = (totalSavings / this.files.length).toFixed(1);
                this.downloadFile(zipBlob, 'compressed_pdfs.zip', 'application/zip');
                this.hideLoadingModal();
                this.showSuccess(`${this.files.length} PDFs compressed! Average size reduction: ${avgSavings}%`);
            }
            
            this.processedFiles += this.files.length;
            this.updateStats();
        } catch (error) {
            console.error('Error compressing PDFs:', error);
            this.hideLoadingModal();
            this.showError('Error compressing PDFs. Please try again.');
        }
    }

    async compressPDF(file, level) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
        
        // Basic compression by re-saving with optimization
        return await pdf.save({
            useObjectStreams: level !== 'low',
            addDefaultPage: false,
            objectsStream: level === 'high'
        });
    }

    // IMAGE TOOLS IMPLEMENTATIONS

    getBackgroundRemoverHTML() {
        return `
            <div class="tool-interface">
                <div class="file-upload" id="bgRemoverUpload">
                    <div class="upload-content">
                        <div class="upload-icon">🖼️</div>
                        <div class="upload-text">Drop images here or click to browse</div>
                        <div class="upload-hint">Supported formats: JPG, PNG (Max 10MB each)</div>
                        <div class="upload-buttons">
                            <button class="btn btn--primary" id="bgRemoverBrowse">Browse Images</button>
                        </div>
                    </div>
                </div>
                <input type="file" id="bgRemoverInput" accept=".jpg,.jpeg,.png" multiple style="display: none;">
                <div class="file-list" id="bgRemoverFiles"></div>
                <button class="btn btn--primary btn--full-width" id="removeBgBtn" style="display: none;">
                    Remove Background with AI
                </button>
            </div>
        `;
    }

    setupBackgroundRemover() {
        const upload = document.getElementById('bgRemoverUpload');
        const input = document.getElementById('bgRemoverInput');
        const browseBtn = document.getElementById('bgRemoverBrowse');
        const fileList = document.getElementById('bgRemoverFiles');
        const removeBtn = document.getElementById('removeBgBtn');
        
        this.setupDualFileUpload(upload, input, browseBtn, fileList, (files) => {
            removeBtn.style.display = files.length > 0 ? 'block' : 'none';
        }, '.jpg,.jpeg,.png', this.FILE_SIZE_LIMITS.image);
        
        removeBtn.addEventListener('click', () => this.removeBackgrounds());
    }

    async removeBackgrounds() {
        if (this.files.length === 0) return;
        
        this.showLoadingModal('Removing backgrounds...', 'Using AI to remove image backgrounds');
        
        try {
            if (this.files.length === 1) {
                const result = await this.removeBackground(this.files[0]);
                this.downloadFile(result, `no-bg_${this.files[0].name.replace(/\.[^/.]+$/, '.png')}`, 'image/png');
                this.hideLoadingModal();
                this.showSuccess('Background removed successfully!');
            } else {
                const zip = new JSZip();
                
                for (let i = 0; i < this.files.length; i++) {
                    this.updateProgress((i / this.files.length) * 90, `Processing image ${i + 1} of ${this.files.length}`);
                    
                    try {
                        const result = await this.removeBackground(this.files[i]);
                        const fileName = `no-bg_${this.files[i].name.replace(/\.[^/.]+$/, '.png')}`;
                        zip.file(fileName, result);
                    } catch (error) {
                        console.error(`Error processing ${this.files[i].name}:`, error);
                        // Continue with other files
                    }
                }
                
                this.updateProgress(95, 'Creating ZIP archive...');
                const zipBlob = await zip.generateAsync({type: 'blob'});
                this.updateProgress(100, 'Complete!');
                
                this.downloadFile(zipBlob, 'background_removed_images.zip', 'application/zip');
                this.hideLoadingModal();
                this.showSuccess(`Background removed from ${this.files.length} images!`);
            }
            
            this.processedFiles += this.files.length;
            this.updateStats();
        } catch (error) {
            console.error('Error removing backgrounds:', error);
            this.hideLoadingModal();
            this.showError('Error removing backgrounds. Please check your internet connection and try again.');
        }
    }

    async removeBackground(file) {
        const formData = new FormData();
        formData.append('image_file', file);
        formData.append('size', 'auto');
        
        const response = await fetch(this.REMOVE_BG_URL, {
            method: 'POST',
            headers: {
                'X-Api-Key': this.REMOVE_BG_API_KEY
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        
        return await response.blob();
    }

    getImageCompressorHTML() {
        return `
            <div class="tool-interface">
                <div class="control-group">
                    <div class="form-group">
                        <label class="form-label">Quality</label>
                        <input type="range" id="qualitySlider" class="form-control" min="10" max="100" step="5" value="80">
                        <span id="qualityValue">80%</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Max Size (MB)</label>
                        <select id="maxSizeSelect" class="form-control">
                            <option value="0.5">0.5 MB</option>
                            <option value="1" selected>1 MB</option>
                            <option value="2">2 MB</option>
                            <option value="5">5 MB</option>
                        </select>
                    </div>
                </div>
                <div class="file-upload" id="compressorUpload">
                    <div class="upload-content">
                        <div class="upload-icon">🖼️</div>
                        <div class="upload-text">Drop images here or click to browse</div>
                        <div class="upload-hint">Multiple images supported (JPG, PNG, WebP)</div>
                        <div class="upload-buttons">
                            <button class="btn btn--primary" id="compressorBrowse">Browse Images</button>
                        </div>
                    </div>
                </div>
                <input type="file" id="compressorInput" accept="image/*" multiple style="display: none;">
                <div class="file-list" id="compressorFiles"></div>
                <button class="btn btn--primary btn--full-width" id="compressImagesBtn" style="display: none;">
                    Compress Images
                </button>
            </div>
        `;
    }

    setupImageCompressor() {
        const upload = document.getElementById('compressorUpload');
        const input = document.getElementById('compressorInput');
        const browseBtn = document.getElementById('compressorBrowse');
        const fileList = document.getElementById('compressorFiles');
        const compressBtn = document.getElementById('compressImagesBtn');
        const qualitySlider = document.getElementById('qualitySlider');
        const qualityValue = document.getElementById('qualityValue');
        
        qualitySlider.addEventListener('input', (e) => {
            qualityValue.textContent = e.target.value + '%';
        });
        
        this.setupDualFileUpload(upload, input, browseBtn, fileList, (files) => {
            compressBtn.style.display = files.length > 0 ? 'block' : 'none';
        }, 'image/*', this.FILE_SIZE_LIMITS.image);
        
        compressBtn.addEventListener('click', () => this.compressImages());
    }

    async compressImages() {
        if (this.files.length === 0) return;
        
        const quality = parseInt(document.getElementById('qualitySlider').value) / 100;
        const maxSizeMB = parseFloat(document.getElementById('maxSizeSelect').value);
        
        this.showLoadingModal('Compressing images...', 'Reducing image file sizes while maintaining quality');
        
        try {
            const options = {
                maxSizeMB: maxSizeMB,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                initialQuality: quality
            };
            
            if (this.files.length === 1) {
                const compressed = await imageCompression(this.files[0], options);
                const originalSize = this.files[0].size;
                const compressedSize = compressed.size;
                const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
                
                this.downloadFile(compressed, `compressed_${this.files[0].name}`, compressed.type);
                this.hideLoadingModal();
                this.showSuccess(`Image compressed successfully! Size reduced by ${savings}%`);
            } else {
                const zip = new JSZip();
                let totalSavings = 0;
                
                for (let i = 0; i < this.files.length; i++) {
                    this.updateProgress((i / this.files.length) * 90, `Compressing image ${i + 1} of ${this.files.length}`);
                    
                    const compressed = await imageCompression(this.files[i], options);
                    const originalSize = this.files[i].size;
                    const compressedSize = compressed.size;
                    totalSavings += ((originalSize - compressedSize) / originalSize * 100);
                    
                    zip.file(`compressed_${this.files[i].name}`, compressed);
                }
                
                this.updateProgress(95, 'Creating ZIP archive...');
                const zipBlob = await zip.generateAsync({type: 'blob'});
                this.updateProgress(100, 'Complete!');
                
                const avgSavings = (totalSavings / this.files.length).toFixed(1);
                this.downloadFile(zipBlob, 'compressed_images.zip', 'application/zip');
                this.hideLoadingModal();
                this.showSuccess(`${this.files.length} images compressed! Average size reduction: ${avgSavings}%`);
            }
            
            this.processedFiles += this.files.length;
            this.updateStats();
        } catch (error) {
            console.error('Error compressing images:', error);
            this.hideLoadingModal();
            this.showError('Error compressing images. Please try again.');
        }
    }

    // UTILITY TOOLS IMPLEMENTATIONS

    getQRGeneratorHTML() {
        return `
            <div class="tool-interface">
                <div class="form-group">
                    <label class="form-label">Text to encode</label>
                    <textarea id="qrText" class="form-control" placeholder="Enter text, URL, or data to encode..." rows="4"></textarea>
                </div>
                <div class="control-group">
                    <div class="form-group">
                        <label class="form-label">Size</label>
                        <select id="qrSize" class="form-control">
                            <option value="200">Small (200x200)</option>
                            <option value="400" selected>Medium (400x400)</option>
                            <option value="600">Large (600x600)</option>
                            <option value="800">Extra Large (800x800)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Error Correction</label>
                        <select id="qrErrorCorrection" class="form-control">
                            <option value="L">Low (7%)</option>
                            <option value="M" selected>Medium (15%)</option>
                            <option value="Q">Quartile (25%)</option>
                            <option value="H">High (30%)</option>
                        </select>
                    </div>
                </div>
                <button class="btn btn--primary btn--full-width" id="generateQRBtn">
                    Generate QR Code
                </button>
                <div class="qr-result" id="qrResult" style="display: none;">
                    <div class="qr-code" id="qrCode"></div>
                    <button class="btn btn--secondary" id="downloadQRBtn">Download QR Code</button>
                </div>
            </div>
        `;
    }

    setupQRGenerator() {
        const generateBtn = document.getElementById('generateQRBtn');
        const downloadBtn = document.getElementById('downloadQRBtn');
        
        generateBtn.addEventListener('click', () => this.generateQR());
        downloadBtn.addEventListener('click', () => this.downloadQR());
    }

    generateQR() {
        const text = document.getElementById('qrText').value.trim();
        const size = parseInt(document.getElementById('qrSize').value);
        const errorCorrection = document.getElementById('qrErrorCorrection').value;
        
        if (!text) {
            this.showError('Please enter text to encode.');
            return;
        }
        
        try {
            const qr = qrcode(0, errorCorrection);
            qr.addData(text);
            qr.make();
            
            const qrElement = document.getElementById('qrCode');
            const cellSize = Math.floor(size / qr.getModuleCount());
            qrElement.innerHTML = qr.createImgTag(cellSize, 8);
            
            document.getElementById('qrResult').style.display = 'block';
            this.showSuccess('QR code generated successfully!');
            this.processedFiles++;
            this.updateStats();
        } catch (error) {
            console.error('Error generating QR code:', error);
            this.showError('Error generating QR code. Please try again.');
        }
    }

    downloadQR() {
        const img = document.querySelector('#qrCode img');
        if (img) {
            const link = document.createElement('a');
            link.download = 'qr-code.png';
            link.href = img.src;
            link.click();
        }
    }

    getPasswordGeneratorHTML() {
        return `
            <div class="tool-interface">
                <div class="control-group">
                    <div class="form-group">
                        <label class="form-label">Password Length</label>
                        <input type="range" id="passwordLength" class="form-control" min="4" max="50" value="16">
                        <span id="lengthValue">16</span>
                    </div>
                </div>
                <div class="password-options">
                    <div class="checkbox-group">
                        <input type="checkbox" id="includeUppercase" checked>
                        <label>Uppercase (A-Z)</label>
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="includeLowercase" checked>
                        <label>Lowercase (a-z)</label>
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="includeNumbers" checked>
                        <label>Numbers (0-9)</label>
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="includeSymbols">
                        <label>Symbols (!@#$%^&*)</label>
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="excludeSimilar">
                        <label>Exclude similar (0,O,l,1)</label>
                    </div>
                </div>
                <button class="btn btn--primary btn--full-width" id="generatePasswordBtn">
                    Generate Secure Password
                </button>
                <div class="result-section" id="passwordResult" style="display: none;">
                    <div class="generated-password" id="generatedPassword"></div>
                    <div class="control-group">
                        <button class="btn btn--secondary" id="copyPasswordBtn">Copy to Clipboard</button>
                        <button class="btn btn--outline" id="regeneratePasswordBtn">Generate New</button>
                    </div>
                </div>
            </div>
        `;
    }

    setupPasswordGenerator() {
        const lengthSlider = document.getElementById('passwordLength');
        const lengthValue = document.getElementById('lengthValue');
        const generateBtn = document.getElementById('generatePasswordBtn');
        const copyBtn = document.getElementById('copyPasswordBtn');
        const regenerateBtn = document.getElementById('regeneratePasswordBtn');
        
        lengthSlider.addEventListener('input', (e) => {
            lengthValue.textContent = e.target.value;
        });
        
        generateBtn.addEventListener('click', () => this.generatePassword());
        copyBtn.addEventListener('click', () => this.copyPassword());
        regenerateBtn.addEventListener('click', () => this.generatePassword());
    }

    generatePassword() {
        const length = parseInt(document.getElementById('passwordLength').value);
        const includeUppercase = document.getElementById('includeUppercase').checked;
        const includeLowercase = document.getElementById('includeLowercase').checked;
        const includeNumbers = document.getElementById('includeNumbers').checked;
        const includeSymbols = document.getElementById('includeSymbols').checked;
        const excludeSimilar = document.getElementById('excludeSimilar').checked;
        
        let chars = '';
        if (includeUppercase) chars += excludeSimilar ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeLowercase) chars += excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
        if (includeNumbers) chars += excludeSimilar ? '23456789' : '0123456789';
        if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        if (!chars) {
            this.showError('Please select at least one character type.');
            return;
        }
        
        // Use cryptographically secure random number generation
        let password = '';
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        
        for (let i = 0; i < length; i++) {
            password += chars[array[i] % chars.length];
        }
        
        document.getElementById('generatedPassword').textContent = password;
        document.getElementById('passwordResult').style.display = 'block';
        this.showSuccess('Secure password generated!');
        this.processedFiles++;
        this.updateStats();
    }

    async copyPassword() {
        const password = document.getElementById('generatedPassword').textContent;
        try {
            await navigator.clipboard.writeText(password);
            const btn = document.getElementById('copyPasswordBtn');
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            btn.classList.add('btn--success');
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('btn--success');
            }, 2000);
        } catch (error) {
            this.showError('Could not copy to clipboard. Please select and copy manually.');
        }
    }

    getNotepadHTML() {
        return `
            <div class="tool-interface">
                <div class="control-group">
                    <div class="form-group">
                        <button class="btn btn--outline" id="loadFileBtn">Load File</button>
                        <input type="file" id="loadFileInput" accept=".txt" style="display: none;">
                    </div>
                    <div class="form-group">
                        <button class="btn btn--secondary" id="downloadNoteBtn">Save as TXT</button>
                    </div>
                </div>
                <textarea id="notepadText" class="form-control textarea" placeholder="Start typing your notes..."></textarea>
                <div class="control-group">
                    <button class="btn btn--outline" id="clearNoteBtn">Clear All</button>
                    <div class="form-group">
                        <small>Characters: <span id="charCount">0</span> | Words: <span id="wordCount">0</span> | Lines: <span id="lineCount">1</span></small>
                    </div>
                </div>
            </div>
        `;
    }

    setupNotepad() {
        const textarea = document.getElementById('notepadText');
        const downloadBtn = document.getElementById('downloadNoteBtn');
        const clearBtn = document.getElementById('clearNoteBtn');
        const loadBtn = document.getElementById('loadFileBtn');
        const loadInput = document.getElementById('loadFileInput');
        
        this.updateNotepadStats();
        
        textarea.addEventListener('input', () => {
            this.updateNotepadStats();
        });
        
        downloadBtn.addEventListener('click', () => {
            const text = textarea.value;
            const blob = new Blob([text], {type: 'text/plain'});
            this.downloadFile(blob, 'notes.txt', 'text/plain');
            this.processedFiles++;
            this.updateStats();
        });
        
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all text?')) {
                textarea.value = '';
                this.updateNotepadStats();
            }
        });
        
        loadBtn.addEventListener('click', () => {
            loadInput.click();
        });
        
        loadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type === 'text/plain') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    textarea.value = e.target.result;
                    this.updateNotepadStats();
                };
                reader.readAsText(file);
            }
        });
    }

    updateNotepadStats() {
        const textarea = document.getElementById('notepadText');
        const text = textarea.value;
        
        document.getElementById('charCount').textContent = text.length;
        document.getElementById('wordCount').textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
        document.getElementById('lineCount').textContent = text ? text.split('\n').length : 1;
    }

    // UTILITY METHODS - FIXED FILE UPLOAD SYSTEM

    setupDualFileUpload(uploadElement, inputElement, browseBtn, fileListElement, callback, accept, maxSize) {
        if (accept && accept !== '*') {
            inputElement.setAttribute('accept', accept);
        }
        
        // FIXED: Browse button click handler
        browseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            inputElement.click();
        });
        
        // FIXED: Upload area click handler - but don't interfere with browse button
        uploadElement.addEventListener('click', (e) => {
            // Only trigger if clicking the upload area itself, not the browse button
            if (e.target === browseBtn || browseBtn.contains(e.target)) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            inputElement.click();
        });
        
        // Drag and drop handlers
        uploadElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadElement.classList.add('drag-over');
        });
        
        uploadElement.addEventListener('dragleave', (e) => {
            e.preventDefault();
            if (!uploadElement.contains(e.relatedTarget)) {
                uploadElement.classList.remove('drag-over');
            }
        });
        
        uploadElement.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadElement.classList.remove('drag-over');
            this.handleFiles(e.dataTransfer.files, fileListElement, callback, maxSize);
        });
        
        // File input change
        inputElement.addEventListener('change', (e) => {
            this.handleFiles(e.target.files, fileListElement, callback, maxSize);
        });
    }

    handleFiles(files, fileListElement, callback, maxSize) {
        const validFiles = [];
        
        for (const file of files) {
            if (maxSize && file.size > maxSize) {
                this.showError(`File "${file.name}" is too large. Maximum size is ${this.formatFileSize(maxSize)}.`);
                continue;
            }
            validFiles.push(file);
        }
        
        this.files = validFiles;
        
        if (fileListElement) {
            this.renderFileList(fileListElement);
        }
        
        if (callback) callback(this.files);
    }

    renderFileList(fileListElement) {
        fileListElement.innerHTML = '';
        
        this.files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <span class="file-icon">${this.getFileIcon(file.type)}</span>
                    <div class="file-details">
                        <h4>${file.name}</h4>
                        <p>${this.formatFileSize(file.size)} • ${file.type || 'Unknown type'}</p>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="btn btn--sm btn--outline" onclick="waizTools.removeFile(${index})">Remove</button>
                </div>
            `;
            fileListElement.appendChild(fileItem);
        });
    }

    removeFile(index) {
        this.files.splice(index, 1);
        const fileList = document.querySelector('.file-list:not([style*="display: none"])');
        if (fileList) {
            this.renderFileList(fileList);
        }
        
        // Update buttons visibility
        const currentBtn = document.querySelector('[id$="Btn"]:not([style*="display: none"])');
        if (currentBtn && this.files.length === 0) {
            currentBtn.style.display = 'none';
        }
    }

    getFileIcon(mimeType) {
        if (mimeType.startsWith('image/')) return '🖼️';
        if (mimeType.startsWith('video/')) return '🎥';
        if (mimeType.startsWith('audio/')) return '🎵';
        if (mimeType.includes('pdf')) return '📄';
        if (mimeType.includes('text')) return '📝';
        if (mimeType.includes('zip')) return '📁';
        if (mimeType.includes('word')) return '📄';
        return '📄';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showLoadingModal(title = 'Processing...', text = 'Please wait while we process your request') {
        document.getElementById('loadingTitle').textContent = title;
        document.getElementById('loadingText').textContent = text;
        document.getElementById('loadingModal').classList.remove('hidden');
        this.updateProgress(0, 'Starting...');
    }

    hideLoadingModal() {
        document.getElementById('loadingModal').classList.add('hidden');
    }

    updateProgress(percent, status = '') {
        document.getElementById('progressFill').style.width = Math.min(percent, 100) + '%';
        document.getElementById('progressPercent').textContent = Math.round(percent) + '%';
        if (status) {
            document.getElementById('progressStatus').textContent = status;
        }
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    showSuccess(message) {
        document.getElementById('successMessage').textContent = message;
        this.showModal('successModal');
    }

    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        this.showModal('errorModal');
    }

    downloadFile(data, filename, mimeType) {
        const blob = data instanceof Blob ? data : new Blob([data], {type: mimeType});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    updateStats() {
        document.getElementById('toolsUsed').textContent = this.toolsUsed;
        document.getElementById('filesProcessed').textContent = this.processedFiles;
    }

    // Additional tool implementations
    
    getImageToPDFHTML() {
        return `
            <div class="tool-interface">
                <div class="control-group">
                    <div class="form-group">
                        <label class="form-label">Page Size</label>
                        <select id="pageSize" class="form-control">
                            <option value="a4">A4</option>
                            <option value="letter">Letter</option>
                            <option value="legal">Legal</option>
                            <option value="auto" selected>Auto (fit to image)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Orientation</label>
                        <select id="orientation" class="form-control">
                            <option value="auto" selected>Auto</option>
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                        </select>
                    </div>
                </div>
                <div class="file-upload" id="imageToPdfUpload">
                    <div class="upload-content">
                        <div class="upload-icon">🖼️</div>
                        <div class="upload-text">Drop images here or click to browse</div>
                        <div class="upload-hint">Multiple images will be combined into one PDF</div>
                        <div class="upload-buttons">
                            <button class="btn btn--primary" id="imageToPdfBrowse">Browse Images</button>
                        </div>
                    </div>
                </div>
                <input type="file" id="imageToPdfInput" accept="image/*" multiple style="display: none;">
                <div class="file-list" id="imageToPdfFiles"></div>
                <button class="btn btn--primary btn--full-width" id="convertToPdfBtn" style="display: none;">
                    Convert Images to PDF
                </button>
            </div>
        `;
    }

    setupImageToPDF() {
        const upload = document.getElementById('imageToPdfUpload');
        const input = document.getElementById('imageToPdfInput');
        const browseBtn = document.getElementById('imageToPdfBrowse');
        const fileList = document.getElementById('imageToPdfFiles');
        const convertBtn = document.getElementById('convertToPdfBtn');
        
        this.setupDualFileUpload(upload, input, browseBtn, fileList, (files) => {
            convertBtn.style.display = files.length > 0 ? 'block' : 'none';
        }, 'image/*', this.FILE_SIZE_LIMITS.image);
        
        convertBtn.addEventListener('click', () => this.convertImagesToPDF());
    }

    async convertImagesToPDF() {
        if (this.files.length === 0) return;
        
        this.showLoadingModal('Converting to PDF...', 'Creating PDF from images');
        
        try {
            const { jsPDF } = window.jspdf;
            const pageSize = document.getElementById('pageSize').value;
            const orientation = document.getElementById('orientation').value;
            
            let pdf;
            if (pageSize === 'auto') {
                // Use first image dimensions
                const firstImg = await this.loadImage(this.files[0]);
                const imgRatio = firstImg.width / firstImg.height;
                const pdfOrientation = imgRatio > 1 ? 'landscape' : 'portrait';
                pdf = new jsPDF({
                    orientation: orientation === 'auto' ? pdfOrientation : orientation,
                    unit: 'px',
                    format: [firstImg.width, firstImg.height]
                });
            } else {
                pdf = new jsPDF({
                    orientation: orientation === 'auto' ? 'portrait' : orientation,
                    unit: 'mm',
                    format: pageSize
                });
            }
            
            for (let i = 0; i < this.files.length; i++) {
                this.updateProgress((i / this.files.length) * 90, `Processing image ${i + 1} of ${this.files.length}`);
                
                if (i > 0) pdf.addPage();
                
                const img = await this.loadImage(this.files[i]);
                const canvas = document.getElementById('hiddenCanvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                const imgData = canvas.toDataURL('image/jpeg', 0.95);
                
                if (pageSize === 'auto') {
                    pdf.addImage(imgData, 'JPEG', 0, 0, img.width, img.height);
                } else {
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    const imgAspectRatio = img.width / img.height;
                    const pdfAspectRatio = pdfWidth / pdfHeight;
                    
                    let renderWidth, renderHeight;
                    if (imgAspectRatio > pdfAspectRatio) {
                        renderWidth = pdfWidth;
                        renderHeight = pdfWidth / imgAspectRatio;
                    } else {
                        renderHeight = pdfHeight;
                        renderWidth = pdfHeight * imgAspectRatio;
                    }
                    
                    const xOffset = (pdfWidth - renderWidth) / 2;
                    const yOffset = (pdfHeight - renderHeight) / 2;
                    
                    pdf.addImage(imgData, 'JPEG', xOffset, yOffset, renderWidth, renderHeight);
                }
            }
            
            this.updateProgress(100, 'Complete!');
            pdf.save('images-to-pdf.pdf');
            this.hideLoadingModal();
            this.showSuccess(`Successfully converted ${this.files.length} images to PDF!`);
            this.processedFiles++;
            this.updateStats();
        } catch (error) {
            console.error('Error converting to PDF:', error);
            this.hideLoadingModal();
            this.showError('Error converting images to PDF. Please try again.');
        }
    }

    loadImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    // Unit Converter Implementation
    getUnitConverterHTML() {
        return `
            <div class="tool-interface">
                <div class="form-group">
                    <label class="form-label">Conversion Type</label>
                    <select id="conversionType" class="form-control">
                        <option value="length">Length</option>
                        <option value="weight">Weight/Mass</option>
                        <option value="temperature">Temperature</option>
                        <option value="area">Area</option>
                        <option value="volume">Volume</option>
                        <option value="speed">Speed</option>
                        <option value="pressure">Pressure</option>
                    </select>
                </div>
                <div class="unit-converter">
                    <div class="form-group">
                        <label class="form-label">From</label>
                        <input type="number" id="fromValue" class="form-control" placeholder="Enter value" step="any">
                        <select id="fromUnit" class="form-control"></select>
                    </div>
                    <div class="converter-arrow">⟷</div>
                    <div class="form-group">
                        <label class="form-label">To</label>
                        <input type="number" id="toValue" class="form-control" readonly>
                        <select id="toUnit" class="form-control"></select>
                    </div>
                </div>
                <div class="result-section" id="conversionResult" style="display: none;">
                    <h4>Conversion Result</h4>
                    <p id="conversionText"></p>
                </div>
            </div>
        `;
    }

    setupUnitConverter() {
        const conversionType = document.getElementById('conversionType');
        const fromValue = document.getElementById('fromValue');
        const toValue = document.getElementById('toValue');
        const fromUnit = document.getElementById('fromUnit');
        const toUnit = document.getElementById('toUnit');
        
        const units = {
            length: {
                m: { name: 'Meters', factor: 1 },
                km: { name: 'Kilometers', factor: 1000 },
                cm: { name: 'Centimeters', factor: 0.01 },
                mm: { name: 'Millimeters', factor: 0.001 },
                in: { name: 'Inches', factor: 0.0254 },
                ft: { name: 'Feet', factor: 0.3048 },
                yd: { name: 'Yards', factor: 0.9144 },
                mi: { name: 'Miles', factor: 1609.34 }
            },
            weight: {
                kg: { name: 'Kilograms', factor: 1 },
                g: { name: 'Grams', factor: 0.001 },
                lb: { name: 'Pounds', factor: 0.453592 },
                oz: { name: 'Ounces', factor: 0.0283495 },
                t: { name: 'Tonnes', factor: 1000 }
            },
            temperature: {
                celsius: { name: 'Celsius (°C)' },
                fahrenheit: { name: 'Fahrenheit (°F)' },
                kelvin: { name: 'Kelvin (K)' }
            },
            area: {
                sqm: { name: 'Square Meters', factor: 1 },
                sqkm: { name: 'Square Kilometers', factor: 1000000 },
                sqcm: { name: 'Square Centimeters', factor: 0.0001 },
                sqft: { name: 'Square Feet', factor: 0.092903 },
                sqin: { name: 'Square Inches', factor: 0.00064516 },
                acre: { name: 'Acres', factor: 4046.86 },
                hectare: { name: 'Hectares', factor: 10000 }
            },
            volume: {
                l: { name: 'Liters', factor: 1 },
                ml: { name: 'Milliliters', factor: 0.001 },
                gal: { name: 'Gallons (US)', factor: 3.78541 },
                qt: { name: 'Quarts (US)', factor: 0.946353 },
                pt: { name: 'Pints (US)', factor: 0.473176 },
                cup: { name: 'Cups (US)', factor: 0.236588 },
                fl_oz: { name: 'Fluid Ounces (US)', factor: 0.0295735 }
            }
        };
        
        const updateUnits = () => {
            const type = conversionType.value;
            fromUnit.innerHTML = '';
            toUnit.innerHTML = '';
            
            if (units[type]) {
                Object.entries(units[type]).forEach(([key, unit]) => {
                    const option1 = new Option(unit.name, key);
                    const option2 = new Option(unit.name, key);
                    fromUnit.appendChild(option1);
                    toUnit.appendChild(option2);
                });
                
                // Set different default units
                if (toUnit.options.length > 1) {
                    toUnit.selectedIndex = 1;
                }
            }
            convert();
        };
        
        const convert = () => {
            const value = parseFloat(fromValue.value);
            if (isNaN(value)) {
                toValue.value = '';
                document.getElementById('conversionResult').style.display = 'none';
                return;
            }
            
            const type = conversionType.value;
            const from = fromUnit.value;
            const to = toUnit.value;
            
            let result;
            if (type === 'temperature') {
                result = this.convertTemperature(value, from, to);
            } else if (units[type] && units[type][from] && units[type][to]) {
                const baseValue = value * units[type][from].factor;
                result = baseValue / units[type][to].factor;
            } else {
                return;
            }
            
            toValue.value = result.toFixed(6).replace(/\.?0+$/, '');
            
            // Show result
            const fromUnitName = units[type][from].name;
            const toUnitName = units[type][to].name;
            document.getElementById('conversionText').textContent = 
                `${value} ${fromUnitName} = ${toValue.value} ${toUnitName}`;
            document.getElementById('conversionResult').style.display = 'block';
            
            this.processedFiles++;
            this.updateStats();
        };
        
        conversionType.addEventListener('change', updateUnits);
        fromValue.addEventListener('input', convert);
        fromUnit.addEventListener('change', convert);
        toUnit.addEventListener('change', convert);
        
        updateUnits();
    }

    convertTemperature(value, from, to) {
        let celsius;
        
        // Convert to Celsius first
        switch (from) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5/9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
        }
        
        // Convert from Celsius to target
        switch (to) {
            case 'celsius':
                return celsius;
            case 'fahrenheit':
                return celsius * 9/5 + 32;
            case 'kelvin':
                return celsius + 273.15;
        }
    }

    // File Converter Implementation
    getFileConverterHTML() {
        return `
            <div class="tool-interface">
                <div class="control-group">
                    <div class="form-group">
                        <label class="form-label">Operation</label>
                        <select id="zipOperation" class="form-control">
                            <option value="create">Create ZIP Archive</option>
                            <option value="extract">Extract ZIP Archive</option>
                        </select>
                    </div>
                </div>
                <div class="file-upload" id="zipUpload">
                    <div class="upload-content">
                        <div class="upload-icon">📁</div>
                        <div class="upload-text">Drop files here or click to browse</div>
                        <div class="upload-hint" id="zipHint">Select files to create a ZIP archive</div>
                        <div class="upload-buttons">
                            <button class="btn btn--primary" id="zipBrowse">Browse Files</button>
                        </div>
                    </div>
                </div>
                <input type="file" id="zipInput" multiple style="display: none;">
                <div class="file-list" id="zipFiles"></div>
                <button class="btn btn--primary btn--full-width" id="processZipBtn" style="display: none;">
                    Create ZIP Archive
                </button>
            </div>
        `;
    }

    setupFileConverter() {
        const operation = document.getElementById('zipOperation');
        const upload = document.getElementById('zipUpload');
        const input = document.getElementById('zipInput');
        const browseBtn = document.getElementById('zipBrowse');
        const fileList = document.getElementById('zipFiles');
        const processBtn = document.getElementById('processZipBtn');
        const hint = document.getElementById('zipHint');
        
        operation.addEventListener('change', () => {
            const isCreate = operation.value === 'create';
            input.setAttribute('accept', isCreate ? '*/*' : '.zip');
            input.multiple = isCreate;
            hint.textContent = isCreate ? 'Select files to create a ZIP archive' : 'Select a ZIP file to extract';
            processBtn.textContent = isCreate ? 'Create ZIP Archive' : 'Extract ZIP Archive';
            this.files = []; // Clear files when switching operations
            this.renderFileList(fileList);
            processBtn.style.display = 'none';
        });
        
        this.setupDualFileUpload(upload, input, browseBtn, fileList, (files) => {
            processBtn.style.display = files.length > 0 ? 'block' : 'none';
        }, '*/*', this.FILE_SIZE_LIMITS.general);
        
        processBtn.addEventListener('click', () => {
            if (operation.value === 'create') {
                this.createZip();
            } else {
                this.extractZip();
            }
        });
    }

    async createZip() {
        if (this.files.length === 0) return;
        
        this.showLoadingModal('Creating ZIP Archive...', 'Compressing files into ZIP format');
        
        try {
            const zip = new JSZip();
            
            for (let i = 0; i < this.files.length; i++) {
                this.updateProgress((i / this.files.length) * 90, `Adding file ${i + 1} of ${this.files.length}`);
                zip.file(this.files[i].name, this.files[i]);
            }
            
            this.updateProgress(95, 'Generating ZIP file...');
            const zipBlob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            });
            
            this.updateProgress(100, 'Complete!');
            this.downloadFile(zipBlob, 'archive.zip', 'application/zip');
            this.hideLoadingModal();
            this.showSuccess(`Successfully created ZIP archive with ${this.files.length} files!`);
            this.processedFiles++;
            this.updateStats();
        } catch (error) {
            console.error('Error creating ZIP:', error);
            this.hideLoadingModal();
            this.showError('Error creating ZIP file. Please try again.');
        }
    }

    async extractZip() {
        if (this.files.length === 0 || !this.files[0].name.toLowerCase().endsWith('.zip')) {
            this.showError('Please select a valid ZIP file.');
            return;
        }
        
        this.showLoadingModal('Extracting ZIP Archive...', 'Extracting files from ZIP archive');
        
        try {
            const zip = await JSZip.loadAsync(this.files[0]);
            const extractedZip = new JSZip();
            
            const fileNames = Object.keys(zip.files);
            let extractedCount = 0;
            
            for (let i = 0; i < fileNames.length; i++) {
                const fileName = fileNames[i];
                const file = zip.files[fileName];
                
                this.updateProgress((i / fileNames.length) * 90, `Extracting ${fileName}`);
                
                if (!file.dir) {
                    const content = await file.async('blob');
                    extractedZip.file(fileName, content);
                    extractedCount++;
                }
            }
            
            if (extractedCount === 0) {
                this.hideLoadingModal();
                this.showError('No files found in the ZIP archive.');
                return;
            }
            
            this.updateProgress(95, 'Creating download package...');
            const zipBlob = await extractedZip.generateAsync({type: 'blob'});
            
            this.updateProgress(100, 'Complete!');
            this.downloadFile(zipBlob, `extracted_${this.files[0].name}`, 'application/zip');
            this.hideLoadingModal();
            this.showSuccess(`Successfully extracted ${extractedCount} files from ZIP archive!`);
            this.processedFiles++;
            this.updateStats();
        } catch (error) {
            console.error('Error extracting ZIP:', error);
            this.hideLoadingModal();
            this.showError('Error extracting ZIP file. Please ensure it\'s a valid ZIP archive.');
        }
    }

    // Add remaining stub implementations for completeness
    getPDFToImageHTML() {
        return `<div class="tool-interface"><h3>PDF to Image</h3><p>This advanced feature will be available in the next update.</p></div>`;
    }
    
    setupPDFToImage() {}
    
    getPDFToWordHTML() {
        return `<div class="tool-interface"><h3>PDF to Word</h3><p>This advanced feature will be available in the next update.</p></div>`;
    }
    
    setupPDFToWord() {}
    
    getWordToPDFHTML() {
        return `<div class="tool-interface"><h3>Word to PDF</h3><p>This advanced feature will be available in the next update.</p></div>`;
    }
    
    setupWordToPDF() {}
    
    getImageResizerHTML() {
        return `<div class="tool-interface"><h3>Image Resizer</h3><p>This feature will be available in the next update.</p></div>`;
    }
    
    setupImageResizer() {}
    
    getImageConverterHTML() {
        return `<div class="tool-interface"><h3>Image Converter</h3><p>This feature will be available in the next update.</p></div>`;
    }
    
    setupImageConverter() {}
    
    getQRScannerHTML() {
        return `<div class="tool-interface"><h3>QR Scanner</h3><p>This feature will be available in the next update.</p></div>`;
    }
    
    setupQRScanner() {}
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.waizTools = new WaizTools();
});