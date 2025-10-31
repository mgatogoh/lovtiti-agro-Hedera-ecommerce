'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Globe, 
  ChevronDown, 
  Check,
  Languages
} from 'lucide-react';
import { 
  SUPPORTED_LANGUAGES, 
  getLanguageByCode, 
  setCurrentLanguage,
  getTranslation 
} from '@/utils/language';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  className?: string;
}

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  className = ''
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = getLanguageByCode(selectedLanguage);

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageChange(languageCode);
    setCurrentLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 min-w-[120px]"
      >
        <Languages className="w-4 h-4" />
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="text-sm font-medium">{currentLanguage?.code.toUpperCase()}</span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>{getTranslation('language.select', selectedLanguage)}</span>
              </CardTitle>
              <CardDescription>
                Choose your preferred language for the interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Popular Languages */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Languages</h4>
                <div className="space-y-1">
                  {SUPPORTED_LANGUAGES.slice(0, 4).map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language.code)}
                      className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors ${
                        selectedLanguage === language.code ? 'bg-green-50 border border-green-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{language.flag}</span>
                        <div className="text-left">
                          <div className="font-medium text-sm">{language.nativeName}</div>
                          <div className="text-xs text-gray-500">{language.name}</div>
                        </div>
                      </div>
                      {selectedLanguage === language.code && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* All Languages */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">All Languages</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {SUPPORTED_LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language.code)}
                      className={`w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors ${
                        selectedLanguage === language.code ? 'bg-green-50 border border-green-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{language.flag}</span>
                        <div className="text-left">
                          <div className="font-medium text-sm">{language.nativeName}</div>
                          <div className="text-xs text-gray-500">{language.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {language.rtl && (
                          <span className="text-xs text-gray-400 px-1 py-0.5 bg-gray-100 rounded">
                            RTL
                          </span>
                        )}
                        {selectedLanguage === language.code && (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Info */}
              <div className="pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                  Language changes will be applied immediately
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
