#!/bin/bash
# Cree le depot Git et le pousse sur GitHub. Double-cliquer pour lancer.
cd "$(dirname "$0")" || exit 1
set -e

echo "=== IntelliHouse — publication sur GitHub ==="
echo

if [ ! -d images/produits ] || [ "$(ls images/produits/*.webp 2>/dev/null | wc -l)" -lt 200 ]; then
  echo "⚠️  Les photos produits sont absentes de images/produits/"
  echo "   Telecharge images-produits.zip et vide-le dans ce dossier,"
  echo "   puis relance ce script."
  echo
  read -p "   Continuer quand meme, sans les photos ? [o/N] " r
  [ "$r" = "o" ] || [ "$r" = "O" ] || exit 1
fi

if [ ! -d .git ]; then
  git init -b main
  git remote add origin https://github.com/kramdane/Intelihouse.git
fi

git add -A
if git diff --cached --quiet; then
  echo "Rien de nouveau a publier."
else
  git commit -m "Site IntelliHouse : catalogue de 260 produits, bilingue FR/darija"
fi

echo
echo "Envoi vers GitHub…"
echo "Si une fenetre de connexion s'ouvre, connecte-toi avec ton compte GitHub."
git push -u origin main

echo
echo "✅ Termine."
echo "   Va sur https://github.com/kramdane/Intelihouse/settings/pages"
echo "   et choisis  Source : GitHub Actions"
echo "   Le site sera sur https://kramdane.github.io/Intelihouse/"
echo
read -p "Appuie sur Entree pour fermer."
