import UIKit
import SafariServices

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        
        let label = UILabel()
        label.text = "Dexscreener Trader"
        label.font = UIFont.systemFont(ofSize: 24, weight: .bold)
        label.textAlignment = .center
        label.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(label)
        
        let instructionLabel = UILabel()
        instructionLabel.text = "Enable the extension in Safari Settings"
        instructionLabel.font = UIFont.systemFont(ofSize: 16)
        instructionLabel.textAlignment = .center
        instructionLabel.numberOfLines = 0
        instructionLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(instructionLabel)
        
        let openSettingsButton = UIButton(type: .system)
        openSettingsButton.setTitle("Open Safari Settings", for: .normal)
        openSettingsButton.titleLabel?.font = UIFont.systemFont(ofSize: 18, weight: .medium)
        openSettingsButton.addTarget(self, action: #selector(openSafariSettings), for: .touchUpInside)
        openSettingsButton.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(openSettingsButton)
        
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            label.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 100),
            
            instructionLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            instructionLabel.topAnchor.constraint(equalTo: label.bottomAnchor, constant: 20),
            instructionLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            instructionLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            openSettingsButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            openSettingsButton.topAnchor.constraint(equalTo: instructionLabel.bottomAnchor, constant: 40)
        ])
    }
    
    @objc func openSafariSettings() {
        guard let url = URL(string: "App-prefs:SAFARI") else { return }
        if UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url)
        }
    }
}
