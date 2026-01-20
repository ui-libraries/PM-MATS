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
$mathMode = isset($input['mathMode']) ? (bool)$input['mathMode'] : true; // Default to math mode

// 2. CACHE (include mode in hash so math/text versions are cached separately)
$hash = md5($latexCode . ($mathMode ? '_math' : '_text'));
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
    // Write TeX - conditionally wrap in math mode
    if ($mathMode) {
        $tex = "\\documentclass[preview]{standalone}\n" .
               "\\usepackage{amsmath}\n" .
               "\\usepackage{principia}\n" . 
               "\\begin{document}\n" .
               "$\\displaystyle\n" .
               "\\begin{aligned}\n" .
               $latexCode . "\n" .
               "\\end{aligned}\n" .
               "$\n" . 
               "\\end{document}\n";
    } else {
        // Text mode - for tabular and other text-mode environments
        $tex = "\\documentclass[preview]{standalone}\n" .
               "\\usepackage{amsmath}\n" .
               "\\usepackage{principia}\n" . 
               "\\begin{document}\n" .
               $latexCode . "\n" .
               "\\end{document}\n";
    }
    file_put_contents($workDir . '/input.tex', $tex);

    // Compile PDF
    $cmd = "timeout $TIMEOUT_SEC pdflatex -interaction=nonstopmode -no-shell-escape -output-directory=" . escapeshellarg($workDir) . " " . escapeshellarg($workDir . '/input.tex');
    exec($cmd . " 2>&1", $out, $ret);
    if ($ret !== 0) {
        $errorOutput = implode(" ", $out);
        
        // Check if this looks like a math-mode error when math mode is disabled
        $hasPrincipiaCommands = preg_match('/\\\\pm(thm|imp|and|or|not|all|some|eq|df|ast|assert)/', $latexCode);
        if (!$mathMode && $hasPrincipiaCommands) {
            throw new Exception("LaTeX compilation failed. Hint: Your input contains Principia math commands but Math mode is unchecked. Try enabling Math mode.");
        }
        
        throw new Exception("LaTeX Error: " . $errorOutput);
    }

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
