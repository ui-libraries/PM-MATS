<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST');

// CONFIG
$CACHE_DIR = __DIR__ . '/cache';
$TEMP_BASE = sys_get_temp_dir(); 
$TIMEOUT_SEC = 5;

function sendError($msg) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $msg]);
    exit;
}

// 1. INPUT
$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['latex']) || trim($input['latex']) === '') {
    sendError('No LaTeX input provided');
}
$latexCode = trim($input['latex']);

// 2. CACHE
$hash = md5($latexCode);
$cacheFile = $CACHE_DIR . '/' . $hash . '.svg';

if (file_exists($cacheFile)) {
    echo json_encode(['success' => true, 'svg' => file_get_contents($cacheFile), 'cached' => true]);
    exit;
}

// 3. RENDER
$jobId = uniqid('tex_', true);
$workDir = $TEMP_BASE . '/' . $jobId;
if (!mkdir($workDir)) sendError("Server cannot create temp dir");

try {
    // Write TeX
    $tex = "\\documentclass[preview]{standalone}\n" .
           "\\usepackage{amsmath}\n" . // Ensure amsmath is here
           "\\usepackage{principia}\n" . 
           "\\begin{document}\n" .
           "$\\displaystyle\n" .      // Force "Display Mode" (bigger, nicer symbols)
           "\\begin{aligned}\n" .      // START alignment environment
           $latexCode . "\n" .         // Inject user code
           "\\end{aligned}\n" .        // END alignment environment
           "$\n" . 
           "\\end{document}\n";
    file_put_contents($workDir . '/input.tex', $tex);

    // Compile PDF
    $cmd = "timeout $TIMEOUT_SEC pdflatex -interaction=nonstopmode -no-shell-escape -output-directory=" . escapeshellarg($workDir) . " " . escapeshellarg($workDir . '/input.tex');
    exec($cmd . " 2>&1", $out, $ret);
    if ($ret !== 0) throw new Exception("LaTeX Error: " . implode(" ", $out));

    // Convert to SVG
    $cmdSvg = "dvisvgm --pdf --no-fonts --optimize " . escapeshellarg($workDir . '/input.pdf') . " -o " . escapeshellarg($workDir . '/output.svg');
    exec($cmdSvg, $outSvg, $retSvg);
    if (!file_exists($workDir . '/output.svg')) throw new Exception("SVG Conversion failed");

    // Save & Return
    $svg = file_get_contents($workDir . '/output.svg');
    file_put_contents($cacheFile, $svg);
    echo json_encode(['success' => true, 'svg' => $svg, 'cached' => false]);

} catch (Exception $e) {
    sendError($e->getMessage());
} finally {
    // Cleanup
    array_map('unlink', glob("$workDir/*"));
    rmdir($workDir);
}
?>
