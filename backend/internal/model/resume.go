package model

type Resume struct {
	FullName    string
	Headline    string
	Email       string
	PhoneNumber string
	ExtraInfos  []string
	Sections    []Section
	SortValue   int
}

type Section struct {
	Name       string
	DataPoints []DataPoint
	SortValue  int
}

type DataPoint struct {
	Heading       string
	JobTitle      string
	DateRange     string
	Description   string
	IsSinglePoint bool
	BulletPoints  []string
	SortValue     int
}
